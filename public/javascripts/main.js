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
            currentOrder.CdID, currentOrder.PricePaid, currentOrder.Date);    
    
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
        for (let i = 0; i < 500; i++) {
            orderDate.setTime(orderDate.getTime() + (minutesToAdd * 60000));
            createOrder();
            let newOrder = new OrderObject(currentOrder.ID, currentOrder.StoreID, currentOrder.SalesPersonID,
                currentOrder.CdID, currentOrder.PricePaid, orderDate);    
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
