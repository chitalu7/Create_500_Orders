//const { response } = require("express");


// instantiate current order object
let currentOrder = {};

//define possible values for order attributes
const possibleStoreIDs = [98053 , 98007, 98077, 98055, 98011, 98046];
const possibleCdIDs = [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];

// define constructor to create an order object
let OrderObject = function (storeID, salesPersonID, cdID, pricePaid, date){
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
        let newOrder = new OrderObject(currentOrder.StoreID, currentOrder.SalesPersonID,
            currentOrder.CdID, currentOrder.PricePaid, currentOrder.Date);    
    
    console.log(newOrder);
   


   /* fetch('/AddOrder', {
        method: "POST",
        body: JSON.stringify(newOrder), 
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => console.log(json),
        createOrder()
        )
        .catch(err => console.log(err));
*/

        $.ajax({
            url : "/AddOrder",
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
            let newOrder = new OrderObject(currentOrder.StoreID, currentOrder.SalesPersonID,
                currentOrder.CdID, currentOrder.PricePaid, orderDate);    
            console.log(newOrder);
            
            /*  fetch('/AddOrderSave', {
                method: "POST",
                body: JSON.stringify(newOrder), 
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json())
                .then(json => console.log(json),
                createOrder()
                )
                .catch(err => console.log(err));
            */

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
    let storeIDIndex = Math.floor(Math.random() * (6));
    currentOrder.StoreID = possibleStoreIDs[storeIDIndex];
    //currentOrder.StoreID = possibleCdIDs[storeIDIndex];
    currentOrder.SalesPersonID = (Math.floor(Math.random() * (4)) + 1) + (4 * storeIDIndex);
    let cdIDIndex =  Math.floor(Math.random() * (10));
    currentOrder.CdID = possibleCdIDs[cdIDIndex];
    currentOrder.PricePaid =  Math.floor(Math.random() * (11)) + 5;
    currentOrder.Date = new Date();
};

//display current order values
function displayCurrentOrder (){
    document.getElementById("StoreID").innerHTML = currentOrder.StoreID;
    document.getElementById("SalesPersonID").innerHTML = currentOrder.SalesPersonID;
    document.getElementById("CdID").innerHTML = currentOrder.CdID;
    document.getElementById("PricePaid").innerHTML = currentOrder.PricePaid;
    document.getElementById("Date").innerHTML = currentOrder.Date;
};


// Everything commented below is old code from Kurt's movie stuff. Keep for reference if needed, strip out when finished.

/*
  
document.getElementById("buttonAdd").addEventListener("click", function () {
    let newMovie = new MovieObject(document.getElementById("title").value, 
    document.getElementById("year").value, selectedGenre);

    fetch('/AddMovie', {
        method: "POST",
        body: JSON.stringify(newMovie),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => console.log(json),
        createList()
        )
        .catch(err => console.log(err));

    // $.ajax({
    //     url : "/AddMovie",
    //     type: "POST",
    //     data: JSON.stringify(newMovie),
    //     contentType: "application/json; charset=utf-8",
    //      success: function (result) {
    //         console.log(result);
    //         createList();
    //     }
    // });
   
});*/

/*
let movieArray = [];

// define a constructor to create movie objects
let MovieObject = function (pTitle, pYear, pGenre) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.Title = pTitle;
    this.Year = pYear;
    this.Genre = pGenre;  // action  comedy  drama  horrow scifi  musical  western
}

let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    createList();

// add button events ************************************************************************
    
// Event listener for create order button
    

    document.getElementById("buttonAdd").addEventListener("click", function () {
        let newMovie = new MovieObject(document.getElementById("title").value, 
        document.getElementById("year").value, selectedGenre);

        fetch('/AddMovie', {
            method: "POST",
            body: JSON.stringify(newMovie),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => console.log(json),
            createList()
            )
            .catch(err => console.log(err));
    
        // $.ajax({
        //     url : "/AddMovie",
        //     type: "POST",
        //     data: JSON.stringify(newMovie),
        //     contentType: "application/json; charset=utf-8",
        //      success: function (result) {
        //         console.log(result);
        //         createList();
        //     }
        // });
       
    });

    document.getElementById("buttonGet").addEventListener("click", function () {
        createList();      
    });

    document.getElementById("buttonDelete").addEventListener("click", function () {
        deleteMovie(document.getElementById("deleteID").value);      
    });
    
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("title").value = "";
        document.getElementById("year").value = "";
    });

    $(document).bind("change", "#select-genre", function (event, ui) {
        selectedGenre = $('#select-genre').val();
    });

  

});  
// end of wait until document has loaded event  *************************************************************************


function createList() {
// update local array from server

    fetch('/getAllMovies')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors

    // $.get("/getAllMovies", function(data, status){  // AJAX get
    //     movieArray = data;  // put the returned server json data into our local array
        
    //       // clear prior data
    //     var divMovieList = document.getElementById("divMovieList");
    //     while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
    //         divMovieList.removeChild(divMovieList.firstChild);
    //     };

    //     var ul = document.createElement('ul');

    //     movieArray.forEach(function (element,) {   // use handy array forEach method
    //         var li = document.createElement('li');
    //         li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
    //         element.Title + "  &nbsp &nbsp  &nbsp &nbsp "  
    //         + element.Year + " &nbsp &nbsp  &nbsp &nbsp  " + element.Genre;
    //         ul.appendChild(li);
    //     });
    //     divMovieList.appendChild(ul)

    // });
};

function fillUL(data) {
    movieArray = data;
    
        // clear prior data
    var divMovieList = document.getElementById("divMovieList");
    while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
        divMovieList.removeChild(divMovieList.firstChild);
    };

    var ul = document.createElement('ul');
    
    movieArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
        element.Title + "  &nbsp &nbsp  &nbsp &nbsp "  
        + element.Year + " &nbsp &nbsp  &nbsp &nbsp  " + element.Genre;
        ul.appendChild(li);
    });
    divMovieList.appendChild(ul)
}

function deleteMovie(ID) {

    fetch('/DeleteMovie/' + ID, {
        method: "DELETE",
       // body: JSON.stringify(_data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json()) 
      .then(json => console.log(json))
      .catch(err => console.log(err));



    // $.ajax({
    //     type: "DELETE",
    //     url: "/DeleteMovie/" +ID,
    //     success: function(result){
    //         alert(result);
    //         createList();
    //     },
    //     error: function (xhr, textStatus, errorThrown) {  
    //         alert("Server could not delete Movie with ID " + ID)
    //     }  
    // });
   
}*/

