const fs = require("fs");
const express = require("express");
const app = express();
const eta = require("eta");
const bodyParser = require('body-parser');
const dayjs = require('dayjs')
const mysql = require('mysql2/promise');

app.engine("eta", eta.renderFile);
eta.configure({
	views: "./views",
	cache: false
});

app.set("views", "./views");
app.set("view cache", false);
app.set("view engine", "eta");
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())
const cors = require('cors');
const {
	log
} = require("console");
app.use(cors())

let connection;
async function initMySQL() {
	connection = await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'crypto_banc'
	});
}

// les fonctions de gestion des produits en base de données
async function loadInvestments(where = "1=1", orderBy = "description") {
	const [rows, fields] = await connection.query('SELECT * FROM investments');
	return rows;
}

async function loadEarnings() {
	const [rows, fields] = await connection.query('SELECT * FROM earnings');
	return rows;
}

async function addInvestment(newInvestment) {
	let [inserted] = await connection.query(`INSERT INTO investments (description, date, sum) VALUES (?, ?, ?)`,
		[newInvestment.description, newInvestment.date, newInvestment.sum]);
	return inserted.description;
}

async function addEarnings(newEarning) {
	let [inserted] = await connection.query(`INSERT INTO earnings (description, date, sum) VALUES (?, ?, ?)`,
		[newEarning.description, newEarning.date, newEarning.sum]);
	return inserted.description;
}

async function removeInvestment(id) {
	connection.query(`DELETE FROM investments WHERE id=?`, [id]);
}



async function loadProduct(id) {}
async function addProduct(product) {}
async function updateProduct(id, product) {}
async function removeProduct(id) {}


app.get("/earnings", async function (req, res) {
	let earnings = await loadEarnings();
	let earningSum = 0;

	for (let i = 0; i < earnings.length; i++) {
		earningSum = earningSum + earnings[i].sum;
	}
	res.render('earningsList.eta', {
		earnings,
		earningSum
	})
})

// GET Investments
app.get("/investments", async function (req, res) {
	let investments = await loadInvestments();
	let investmentSum = 0;

	for (let i = 0; i < investments.length; i++) {
		investmentSum = investmentSum + investments[i].sum;
	}

	res.render('investmentsList.eta', {
		investments,
		investmentSum
	});
});

// GET Earnings

app.get("/details/:id", async function (req, res) {});

///////////////////////////////////////////

// les pages du site web
app.get("/", function (req, res) {
	res.redirect("/office/investments");
});

// les requêtes REST du backoffice

// GET Investments
app.get("/office/investments", async function (req, res) {
	let investments = await loadInvestments();

	investments.forEach(element => {
		element.date = dayjs(element.date).format("DD/MM/YYYY");
	});

	res.send(investments);
});

// GET Earnings
app.get("/office/earnings", async function (req, res) {
	let earnings = await loadEarnings();

		earnings.forEach(element => {
			element.date = dayjs(element.date).format("DD/MM/YYYY");
		});

	res.send(earnings);
});

// ADD NEW ITEMS ===================
app.post("/office/investments", async function (req, res) {
	let newInvestment = req.body;
	let investResponse = await addInvestment(newInvestment);

	res.send({
		investResponse
	});
})

app.post("/office/earnings", async function (req, res) {
	let newEarning = req.body;
	let earningResponse = await addEarnings(newEarning);

	res.send({
		earningResponse
	});
})
//===============================================

app.delete("/office/investments/:id", async function (req, res) {
	let investment = req.params.id;

	if (!investment) return res.send({
		error: "product not found"
	})
	
	let deleteItem = await removeInvestment(investment);

	res.send({
		data: deleteItem
	})
});

app.get("/office/products/:id", function (req, res) {});
app.post("/office/products", function (req, res) {});
app.put("/office/products/:id", function (req, res) {});
app.delete("/office/products/:id", function (req, res) {});


app.listen(8000, async function () {
	console.log("listening on port 8000");
	await initMySQL();
});