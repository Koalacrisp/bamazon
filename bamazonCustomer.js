var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function displayItems(){
	var query = "SELECT * FROM bamazon.products"
	connection.query(query, function(err, res){
    	for (var i = 0; i < res.length; i++) {
    		console.log(
    			"\nItem ID: " + res[i].item_id + " || " +
    			"Name: " + res[i].product_name + " || " +
    			"Price: " + "$" + res[i].price + " || " +
    			"Quantity: " + res[i].stock_quantity
    		)
    	}
    });
};

displayItems();

function runSearch() {
  inquirer
    .prompt({
      name: "item",
      type: "input",
      message: "Enter the item ID for the item you wish to purchase",
    })
    .then(function(answer) {
    	var query = "SELECT * FROM bamazon.products WHERE item_id = " + answer.item;
    	connection.query(query, function(err, res){
    		for (var i = 0; i < res.length; i++) {
	    		console.log(
	    			"Name: " + res[i].product_name + " || " +
	    			"Price: " + "$" + res[i].price + " || " +
	    			"Quantity: " + res[i].stock_quantity
	    		)
    		}
    		inquirer.prompt({
    			name: "amount",
    			type: "input",
    			message: "Enter the amount you wish to purchase",
    		}).then(function(answer) {
    			if (answer.amount > 0){
	    			for (var i = 0; i < res.length; i++) {
		    			if (res[i].stock_quantity - answer.amount > 0){
		    				connection.query("UPDATE products SET stock_quantity = stock_quantity - " + answer.amount + " WHERE item_id = " + res[i].item_id)
		    				console.log("Total: " + "$" + res[i].price * answer.amount)
		    				console.log("Thank you for your purchase!")
		    			}else{
		    				console.log("There is not enough in stock!")
		    			}
		    		}
		    	}
    		})
    	});
    });
};