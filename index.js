
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
        readEmployees();  
      });
           
}


function readEmployees() {
    console.log("Selecting all Employees...\n");
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      connection.end();  
    });
  }

  start();