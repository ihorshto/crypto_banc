<script setup>
import { ref } from 'vue'


let investments = ref([]);


let investmentSum = 0;

let loadInvestment = function () {
  fetch("http://localhost:8000/office/investments", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {

      data.forEach(element => {
        investmentSum += element.sum;
      });

      let myDate = data;

      console.log('myDate', myDate[0])

      investments.value = data;
    })
}
loadInvestment();

let addInvestment = function (event) {
  event.preventDefault();
  let investmentDescr = document.getElementById("description").value;
  let investmentDate = document.getElementById("date").value;
  let investmentSum = document.getElementById("sum").value;

  if (!investmentDescr || !investmentSum || !investmentDate) {
    alert("Fill all the fields")
  } else {
    fetch("http://localhost:8000/office/investments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: investmentDescr,
        date: investmentDate,
        sum: investmentSum,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Investment added successfully", data);
        // Perform any additional actions after successful addition
      })
      .catch(error => {
        console.error("Error adding investment", error);
        // Handle error (e.g., show error message)
      });
    document.location.href = '/investments';
  }
}


let removeItem = function (id) {
  console.log("Remove item:" + id);

  fetch("http://localhost:8000/office/investments/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(data => console.log("response", data));

  document.location.href = '/investments';
}



let changeItem = function () {
  console.log("Change item")
}


</script>

<template>
  <main>
    <div class="container">
      <img class="content-img" src="@/assets/trre.png" alt="">
      <div class="content_box">
        <h2 class="content-title"> Investments </h2>
        <p class="content-text" id="investSum">Sum of investments: {{ investmentSum }}$</p>
      </div>
      <form class="content_form" @submit="addInvestment">
        <div class="content_form-row">
          <div class="col-7 content_form-el">
            <input type="text" id="description" class="form-control" placeholder="Description">
          </div>
          <div class="col-2 content_form-el">
            <input type="date" id="date" class="form-control" placeholder="Date">
          </div>
          <div class="col-2 content_form-el">
            <input type="number" id="sum" class="form-control" placeholder="Sum">
          </div>
          <button class="content_form-btn content_form-el" type="submit">+</button>
        </div>
      </form>
      <div class="table_wrapper">
        <table>
          <thead>
            <tr class="table100-head">
              <th class="column1">Id</th>
              <th class="column2">Description</th>
              <th class="column3">Date</th>
              <th class="column4">Sum</th>
              <th class="column5">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="investment in investments" :key="investment.id">
              <td class="column1">{{ investment.id }}</td>
              <td class="column2">{{ investment.description }}</td>
              <td class="column3">{{ investment.date }}</td>
              <td class="column4">{{ investment.sum }}$</td>
              <td class="column5 column-btn">
                <button class="remove-btn" v-on:click="removeItem(investment.id)">
                  <img class="" src="@/assets/trash.svg" alt="">
                </button>
                <button class="modify-btn" v-on:click="changeItem">
                  <img class="" src="@/assets/gear.svg" alt="">
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
