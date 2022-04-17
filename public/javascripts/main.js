//const { response } = require("express");
let orderArray = [];

// instantiate current order object
let currentOrder = {};

//define possible values for order attributes
const possibleStoreIDs = [98053 , 98007, 98077, 98055, 98011, 98046];
const possibleCdIDs = [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];

// define constructor to create an order object
let OrderObject = function (id, storeID, salesPersonID, cdID, pricePaid, date){
    this.ID = id;
    this.StoreID = storeID;
    this.SalesPersonID = salesPersonID;
    this.CdID = cdID;
    this.PricePaid = pricePaid;
    this.Date = date;
};

// wait for DOM to load before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    

    document.getElementById("buttonCreateOrder").addEventListener("click", function (){
        createOrder();
        displayCurrentOrder();
    });

    // assigns property values to new order object
    document.getElementById("buttonSubmitOne").addEventListener("click", function() {
        createOrder();
        let newOrder = new OrderObject(currentOrder.ID, currentOrder.StoreID, currentOrder.SalesPersonID,
            currentOrder.CdID, currentOrder.PricePaid, currentOrder.Date.toISOString());    
    
    console.log(newOrder);

        $.ajax({
            url : "/AddOrderSave",
            type : "POST",
            data: JSON.stringify(newOrder),
            contentType: "application/json; charset=utf-8",
            success: function(result) {
                console.log(result);
            }
        });

    });
    document.getElementById("buttonSubmit500").addEventListener("click", function() {
        let orderDate =  new Date();
        let minutesToAdd = 0;
        for (let i = 0; i < 15; i++) {
            orderDate.setTime(orderDate.getTime() + (minutesToAdd * 60000));
            createOrder();
            let newOrder = new OrderObject(currentOrder.ID, currentOrder.StoreID, currentOrder.SalesPersonID,
                currentOrder.CdID, currentOrder.PricePaid, orderDate.toISOString());    
            console.log(newOrder);

            $.ajax({
                url : "/AddOrderSave",
                type : "POST",
                data: JSON.stringify(newOrder),
                contentType: "application/json; charset=utf-8",
                success: function(result) {
                    console.log(result);
                }
            });
            
            minutesToAdd = Math.floor(Math.random() * 26) + 5; //increment time by 5-30 minutes
        }
    });

    document.getElementById("buttonSalesAtStore").addEventListener("click", function() {
        createListOfSalesAtSpecificStore();
    });

    document.getElementById("buttonSalesPersonTotalCashSales").addEventListener("click", function() {
        createListOfSalesTotalPerSalesPerson();
    });

    document.getElementById("buttonLoad").addEventListener("click", function () {
        createList();      
    });
});

//generate new random values and assign to currentOrder
function createOrder() {
    currentOrder.ID = this.ID = Math.random().toString(16).slice(5);
    let storeIDIndex = Math.floor(Math.random() * (6));
    currentOrder.StoreID = possibleStoreIDs[storeIDIndex];
    //currentOrder.StoreID = possibleCdIDs[storeIDIndex];
    currentOrder.SalesPersonID = (Math.floor(Math.random() * (4)) + 1) + (4 * storeIDIndex);
    let cdIDIndex =  Math.floor(Math.random() * (10));
    currentOrder.CdID = possibleCdIDs[cdIDIndex];
    currentOrder.PricePaid =  Math.floor(Math.random() * (11)) + 5;
    currentOrder.Date = new Date();
}

//display current order values
function displayCurrentOrder (){
    document.getElementById("StoreID").innerHTML = currentOrder.StoreID;
    document.getElementById("SalesPersonID").innerHTML = currentOrder.SalesPersonID;
    document.getElementById("CdID").innerHTML = currentOrder.CdID;
    document.getElementById("PricePaid").innerHTML = currentOrder.PricePaid;
    document.getElementById("Date").innerHTML = currentOrder.Date;
}

function createList(){
    fetch('/getAllOrders')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors
    console.log(responseData);
}

function createListOfSalesAtSpecificStore(){
    fetch('/getSalesInRange')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors
    console.log(responseData);
}

function createListOfSalesTotalPerSalesPerson(){
    fetch('/getSalesPersonAggregate')
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillTotalCashSalesUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors
    console.log(responseData)
}

function fillUL(data) {
   // Object.values(data);
    console.log(data);
   
    orderArray = data;
    //console.log(typeof orderArray);
        // clear prior data
    var divOrderList = document.getElementById("divOrderList");
    while (divOrderList.firstChild) {    // remove any old data so don't get duplicates
        divOrderList.removeChild(divOrderList.firstChild);
    };

    var ul = document.createElement('ul');
   
    orderArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
            element.StoreID + "  &nbsp &nbsp  &nbsp &nbsp " + 
            element.SalesPersonID + " &nbsp &nbsp  &nbsp &nbsp  " + 
            element.CdID + " &nbsp &nbsp  &nbsp &nbsp  " + 
            element.PricePaid + " &nbsp &nbsp  &nbsp &nbsp  " + 
            element.Date;
        ul.appendChild(li);
    });
    divOrderList.appendChild(ul)
    
}

// total cash sales populate div
function fillTotalCashSalesUL(data) {
    // Object.values(data);
     console.log(data);

     // Div container displaying queries
    var queryDisplay = document.getElementById("QueryDisplay");

    queryDisplay.style.visibility = "visible";
     
     queryDisplay.innerHTML = 
      "<h2>Total Cash Sales Made by Each Sales Person (Sorted by High to Low)</h2>" + 
      "<div id=\"textString\"> StoreID: &nbsp &nbsp  &nbsp &nbsp " + 
      "SalesPersonID: &nbsp &nbsp  &nbsp &nbsp " +
      "Total Cash Sales($): &nbsp  &nbsp &nbsp  &nbsp" + 
      " As of (Date Today):   </div>" + 
      "<div id=\"divTotalCashSales\"></div>";
    
     orderArray = data;
     //console.log(typeof orderArray);
         // clear prior data
     var divTotalCashSales = document.getElementById("divTotalCashSales");
     while (divTotalCashSales.firstChild) {    // remove any old data so don't get duplicates
        divTotalCashSales.removeChild(divTotalCashSales.firstChild);
     };
 
     var ul = document.createElement('ul');
    
     orderArray.forEach(function (element,) {   // use handy array forEach method
         var li = document.createElement('li');
         li.innerHTML = 
             element.StoreID + "&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp" +
             element.SalesPersonID + " &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp " +
             element.PricePaid + " &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp" + 
             element.Date;
         ul.appendChild(li);
     });
     divTotalCashSales.appendChild(ul)
     
 }


