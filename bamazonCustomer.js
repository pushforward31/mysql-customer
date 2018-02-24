// The app should then prompt users with two messages#

//    # The first should ask them the ID of the product they would like to buy#
//    # The second message should ask how many units of the product they would like to buy#

// 7# Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request#

//    # If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through#

// 8# However, if your store _does_ have enough of the product, you should fulfill the customer's order#
//    # This means updating the SQL database to reflect the remaining quantity#
//    # Once the update goes through, show the customer the total cost of their purchase#




var inquirer = require("inquirer");
var mysql = require("mysql");
var resArray;


var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    user: "root",

    password: "root",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected is id " + connection.threatId);
    //productStuff();
    preStep();
});

function productStuff() {

  var query = connection.query("SELECT * FROM bamazonDB.products", function(err, res) {
        console.log(res)
        // for (var i = 0; i < res.length; i++) {
        //     resArray.push(res[i].products);
        // }
        // return resArray;
        // console.log(resArray);
        
    });
    //console.log(query.sql)
    stepOne();
}

function preStep(){
inquirer.prompt({
	name: "start",
	type: "rawlist",
	message: "Do you want to shop today?",
	choices: ["Sure do", "Wrong store"]
})
.then(function(answer){

	if (answer.start === "Sure do"){
		
		productStuff();
	}
	else{
		console.log("Make sure you read the sign next time!!!")
	}
});
}

function stepOne() {

   connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        inquirer.prompt([
        		{

                    name: "ID",
                    type: "rawlist",
                    choices: function() {
                        resArray = [];
                        for (var i = 0; i < results.length; i++) {
                            resArray.push(results[i].ITEM_ID);
                        }
                        return resArray;
                    },
                    message: "Choose the item_id of the product you want to purchase!"
                },
                {
                    name: "item",
                    type: "input",
                    message: "How many pieces of this item would you like?"
                   
                }

            ])
            .then(function(answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].ITEM_ID === answer.ID) {
                        chosenItem = results[i];
                    }
                }

                if (chosenItem.stock_quanity > parseInt(answer.item)) {
                    // var newQuantity = parseInt(chosenItem.stock_quanity) - parseInt(answer.item);
                    // var moneyOwed = answer.item * chosenItem.price;
                    connection.query(
                        "UPDATE products SET ? WHERE ?", [{
                                stock_quantity: answer.item
                            },
                            {
                                product_name: chosenItem.product_name
                            }
                        ],
                        function(error) {
                            if (error) throw err;
                            //console.log(res.affectedRows + " products updated!\n");
                            console.log("We have your order ready, as long you pay your bill of " + moneyOwed);
                            preStep();
                        }
                    );
                } else {
                    console.log("Unfornately we do not have enough in stock");
                    preStep();
                }



            });


    });
   connection.end();
}