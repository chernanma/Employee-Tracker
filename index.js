
const logo = require('asciiart-logo');
const inquirer = require("inquirer");
const connection = require('./db/connection');
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

connection.startconnection();

