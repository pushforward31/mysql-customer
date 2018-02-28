//### Challenge #2: Manager View (Next Level)

// Create a new Node application called `bamazonManager.js`. Running this application will:

// List a set of menu options:

// View Products for Sale

// View Low Inventory

// Add to Inventory

// Add New Product

// If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

// If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

// If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

// If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,


    user: "root",

    password: "root",
    database: "bamazonDB"
});


connection.connect(function(err) {

    startManage();
});


function startManage() {
    inquirer.prompt([{
            name: "options",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }])
        .then(function(answer) {
            if (answer.options === "View Products for Sale") {
                viewProducts();
            } else if (answer.options === "View Low Inventory") {
                lowInventory();
            } else if (answer.options === "Add to Inventory") {
                addInventory();
            } else {
                addProduct();
            }

        });
}

function viewProducts() {

    connection.query("SELECT * FROM products", function(err, results) {
        inquirer.prompt([{
            name: "view",
            type: "rawlist",
            message: "Choose an option",
            choices: ["View storage", "Exit View"]
        }]).then(function(answer) {

            if (answer.view === "View storage") {
                console.log(results);
                startManage();
            } else {
                console.log("Have a good day");
                startManage();
            }

        });
    });
}



function lowInventory() {

    connection.query("SELECT * FROM products", function(err, results) {
        inquirer.prompt([{
            name: "low",
            type: "rawlist",
            message: "Choose an option",
            choices: ["Low inventory List", "Exit Inventory Check"]
        }]).then(function(answer) {
            var chosenItem = results[i];

            for (var i = 0; i < results.length; i++) {
                if (results[i].stock_quantity <= 100) {
                    console.log(results[i].product_name);

                }
            }
            startManage();

        });

    });
}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log(JSON.stringify(results))
        inquirer.prompt([{
                name: "nameChoice",
                type: "rawlist",
                choices: choices(results),
                message: "Choose the Item_id of the inventory to increase?"
            },
            {
                name: "add",
                type: "input",
                message: "How much product do you need to order?"
            }
        ]).then(function(answer) {

            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].ITEM_ID.toString() == answer.nameChoice.toString()) {
                    chosenItem = results[i];
                    var newQuantity = chosenItem.stock_quantity + parseInt(answer.add);

                    connection.query(
                        "UPDATE products SET ? WHERE ?", [{
                                stock_quantity: newQuantity
                            },
                            {
                                ITEM_ID: chosenItem.ITEM_ID
                            }
                        ],

                        console.log("Inventory has been replenished")
                      //  console.log("The store now has " + newQuantity + " in stock!");
                      //  
                    );
                    console.log("The store now has " + newQuantity + " in stock!");
                    startManage();

                }
            }



        });
    });

}

function addProduct() {

    inquirer.prompt([{
            name: "product_name",
            type: "input",
            message: "What is the name of the product?"
        },
        {
            name: "department",
            type: "input",
            message: "What department can the product be found?"
        },
        {
            name: "price",
            type: "input",
            message: "How much are does this product cost?"
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How much does of this product is in stock?"
        }
    ]).then(function(answer) {

        connection.query(
            "INSERT INTO products SET ?", {
                product_name: answer.product_name,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.stock_quantity
            },
            function(err) {
                if (err) throw err;
                console.log("Your product had been added!!");

                startManage();
            }
        );
    });

}

function choices(results) {
    var resArray = [];
    for (var i = 0; i < results.length; i++) {
        var id = results[i].ITEM_ID.toString();
        resArray.push(id);
    }
    return resArray;
}