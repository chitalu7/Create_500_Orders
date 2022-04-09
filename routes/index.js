let x = 2;
var express = require('express');
var router = express.Router();
var fs = require("fs");


// start by creating data so we don't have to type it in each time
let ServerOrderArray = [];

// define constructor to create an order object
let OrderObject = function (storeID, salesPersonID, cdID, pricePaid, date){
  this.StoreID = storeID;
  this.SalesPersonID = salesPersonID;
  this.CdID = cdID;
  this.PricePaid = pricePaid;
  this.Date = date;
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* Add one new Order */
router.post('/AddOrder', function(req, res) {
  const newOrder = req.body;  // get the object from the req object sent from browser
  console.log(newOrder);
  /*fileManager.write();*/

  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Added Successfully'
  }
  res.end(JSON.stringify(response)); // send reply
});

/* Add one new Order and log to file */
router.post('/AddOrderSave', function(req, res) {
  const newOrder = req.body;  // get the object from the req object sent from browser
  console.log(newOrder);
  fileManager.write(newOrder); //send new order to file manager for writing

  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Added and Saved Successfully'
  }
  res.end(JSON.stringify(response)); // send reply
});

module.exports = router;

fileManager  = {
  write: function(orderToWrite) {
    console.log(orderToWrite);
    let data = JSON.stringify(orderToWrite);    // take our object data and make it writeable
    fs.appendFileSync('ordersData.json', data + ",\n");  // write it, including a comma spearator and newline character
  },
}
