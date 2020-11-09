
const logo = require('asciiart-logo');
const inquirer = require("inquirer");
const connection = require('./db/connection');
const cTable = require('console.table');
//Adding Logo using  Asciiart module
console.log(
    logo({
        name: 'Employee Tracker',        
        lineChars: 20,
        padding: 2,
        margin: 3,
        borderColor: 'red',
        logoColor: 'bold-red',
        textColor: 'white',
    })
    .emptyLine()
    .right('version 1.0.0')
    .emptyLine()
    .left('by Cesar H Martinez')
    .render()
);

function start(){
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected as id " + connection.threadId + "\n");
         promptMenu();
      });
           
}

function promptMenu() {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "View all Employees",
          "View all Employees by Department",
          "View all Employees by Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View all Roles",
          "Add Role",
          "Remove Role",
          "Update Role",
          "View all Departments",
          "Add Department",
          "Remove Department",
          "View the total utilized budget of a Department",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View all Employees":
            viewEmployees();            
            break;
        case "View all Employees by Department":
            viewEmployees();
            break;
        case "View all Employees by Manager":
            viewEmployees();
            break;
        case "Add Employee":
            viewEmployees();
            break;
        case "Remove Employee":
            viewEmployees();
            break;
        case "Update Employee Role":
            viewEmployees();
            break;
        case "Update Employee Manager":
            viewEmployees();
            break;
        case "View all Roles":
            viewRoles();
            break;
        case "Add Role":
            viewEmployees();
            break;
        case "Remove Role":
            viewEmployees();
            break;
        case "Update Role":
            viewEmployees();
            break;
        case "View all Departments":
            viewDepartments();
            break;
        case "Add Department":
            createDepartment();
            break;
        case "Remove Department":
            viewEmployees();
            break;
        case "View the total utilized budget of a Department":
            viewEmployees();
            break;
        case "Exit":
            connection.end();
            break;           
        }
      });
      
  }

function viewEmployees() {    
    console.log("Selecting all Employees...\n");
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement      
      console.table(res);
      promptMenu();
    });
  }

function viewDepartments() {
    console.log("Selecting all Departments...\n");
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement      
        console.table(res);
        promptMenu();
    });
}

function createDepartment() {

    inquirer
        .prompt({            
            name: "name",
            type: "input",
            message: "Please, enter name of new Department: "
        })
        .then(answers => {
            //Inserting new value to department table
            console.log("Creating new department...\n");
            var query = connection.query(
            "INSERT INTO department SET ?",
            {
                name: answers.name                
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                viewDepartments();
                promptMenu();
            }
            );

        })
        .catch(error => {
            if(error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            } else {
            // Something else when wrong
            }
    });
    
}


function viewRoles() {
    console.log("Selecting all Roles...\n");
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement      
        console.table(res);
        promptMenu();
    });
}





  start();