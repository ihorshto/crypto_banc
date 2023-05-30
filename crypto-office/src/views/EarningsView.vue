<script setup>
import { ref } from 'vue'

let earnings = ref([]);


let earningSum = 0;

let loadEarnings = function () {
  fetch("http://localhost:8000/office/earnings", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {

      data.forEach(element => {
        earningSum += element.sum;
      });

      earnings.value = data;
    })
}
loadEarnings();

let addEarnings = function (event) {
  event.preventDefault();
  let earningsDescr = document.getElementById("description").value;
  let earningsDate = document.getElementById("date").value;
  let earningsSum = document.getElementById("sum").value;

  console.log("addEarnings")

  if (!earningsDescr || !earningsDate || !earningsSum) {
    alert("Fill all the fields")
  } else {
    fetch("http://localhost:8000/office/earnings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: earningsDescr,
        date: earningsDate,
        sum: earningsSum,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Earnings added successfully", data);
        // Perform any additional actions after successful addition
      })
      .catch(error => {
        console.error("Error adding earnings", error);
        // Handle error (e.g., show error message)
      });
    document.location.href = '/earnings';
  }
}

</script>

<template>
  <main>
    <div class="container">
      <img class="content-img" src="@/assets/trre.png" alt="">
      <div class="content_box">
        <h2 class="content-title"> Earnings </h2>
        <p class="content-text" id="investSum">Sum of earnings: {{ earningSum }}$</p>
      </div>
      <form class="content_form" @submit="addEarnings">
        <div class="content_form-row">
          <div class="col-7 content_form-el">
            <input id="description" type="text" class="form-control" placeholder="Description">
          </div>
          <div class="col-2 content_form-el">
            <input id="date" type="date" class="form-control" placeholder="Date">
          </div>
          <div class="col-2 content_form-el">
            <input id="sum" type="number" class="form-control" placeholder="Sum">
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="earningItem in earnings" :key="earningItem.id">
              <td class="column1">{{ earningItem.id }}</td>
              <td class="column2">{{ earningItem.description }}</td>
              <td class="column3">{{ earningItem.date }}</td>
              <td class="column4">{{ earningItem.sum }}$</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
