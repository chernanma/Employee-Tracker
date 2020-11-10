
const logo = require('asciiart-logo');
const inquirer = require("inquirer");
const connection = require('./db/connection');
const cTable = require('console.table');

function banner(){
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
}


function start(){
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected as id " + connection.threadId + "\n");  
         banner();      
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
            console.clear();
            banner();
            viewEmployees();            
            break;
        case "View all Employees by Department":
            console.clear();
            banner();
            viewDepartments();
            break;
        case "View all Employees by Manager":
            console.clear();
            banner();
            viewEmployeesbyManager();
            break;
        case "Add Employee":
            createEmployee();
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
            console.clear();
            banner();
            viewRoles();
            break;
        case "Add Role":
            createRole();
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
            console.clear();
            banner();
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
  

  function createEmployee() {
    let roleArray=[];    
    connection.query("SELECT * FROM role", function(err, resRole) {
        if (err) throw err;
        // Log all results of the SELECT statement      
        for (var i=0;i<resRole.length;i++){
            roleArray.push(resRole[i].title);
        }
        let employeeArray=[]; 
        connection.query("SELECT * FROM employee", function(err, resEmployee) {
            if (err) throw err;
            // Log all results of the SELECT statement      
            for (var i=0;i<resEmployee.length;i++){
                employeeArray.push(resEmployee[i].first_name + " " + resEmployee[i].last_name);
            }

        inquirer
            .prompt([
                {            
                name: "first_name",
                type: "input",
                message: "Please, enter First Name: "
                },
                {            
                    name: "last_name",
                    type: "input",
                    message: "Please, enter Last Name: "
                },
                {
                    name: "choice_role",
                    type: "rawlist",
                    message: "Select Role",
                    choices: roleArray                    
                },                
                {
                    name: "choice_manager",
                    type: "rawlist",
                    message: "Select Manager",
                    choices: employeeArray                    
                }
            ])
            .then(answers => {
                //Inserting new value to employee table
                console.log("Creating new employee...\n");                
                let roleId;
                for (i=0; i< resRole.length;i++){
                    if (resRole[i].title === answers.choice_role) {
                        roleId = resRole[i].id;
                    } 
                 }    
                // let roleId; 
                // connection.query(`SELECT id FROM role WHERE title="${answers.choice_role}"`,function(err, res) {
                //     if (err) throw err;
                //     // Log all results of the SELECT statement    
                //     roleId=res.id;  
                    
                // });
                console.log(roleId);
                let managerId;
                console.log(answers.choice_manager);
                console.log(resEmployee);
                let fullname;
                for (let i=0; i<resEmployee.length;i++){
                    fullname = resEmployee[i].first_name +" "+resEmployee[i].last_name;
                    
                    if (fullname === answers.choice_manager){
                        managerId=resEmployee[i].id;
                    }
                }                
                // let managerId = connection.query(`SELECT id FROM employee WHERE first_name=${answers.choice_manager.first_name} AND last_name=${answers.choice_manager.last_name}`,function(err, res) {
                //     if (err) throw err;
                //     // Log all results of the SELECT statement    
                //     return res;  
                // });                
                connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answers.first_name,
                    last_name: answers.last_name,
                    role_id: roleId,
                    manager_id: managerId
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " record inserted!\n");
                    // Call updateProduct AFTER the INSERT completes                
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

        });
            
    });
}

function viewEmployeesbyManager() {
    var query = "SELECT e1.id, e1.first_name, e1.last_name FROM employee e1 inner join employee e2 on e1.id=e2.manager_id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt({
            name: "choice",
            type: "rawlist",
            message: "Choose Manager",
            choices: function(){
                const managerArray = [];
                for (let i=0; i<res.length;i++){
                    managerArray.push(res[i].first_name + " " + res[i].last_name);
                }
                return managerArray;
            }
            })   
            .then(function(answer) {                
                let chosenManager;
                for (let i = 0; i<res.length; i++){
                    if ((res[i].first_name + " " + res[i].last_name)=== answer.choice){
                        chosenManager=res[i].id;
                    }
                }
                console.log("Employees under " + answer.choice +"..\n");
                connection.query(`SELECT * FROM employee WHERE manager_id=${chosenManager}`, function(err, res) {
                    if (err) throw err;
                    // Log all results of the SELECT statement      
                    console.table(res);
                    promptMenu();
                });
            })   
                 
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
                console.log(res.affectedRows + " record inserted!\n");
                // Call updateProduct AFTER the INSERT completes                
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


function createRole() {
    const departmentArray=[];    
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement      
        for (var i=0;i<res.length;i++){
            departmentArray.push(res[i]);
        }
        inquirer
            .prompt([
                {            
                name: "title",
                type: "input",
                message: "Please, enter title for new Role: "
                },
                {            
                    name: "salary",
                    type: "input",
                    message: "Please, enter salary for new Role: "
                },
                {
                    name: "choice",
                    type: "rawlist",
                    message: "Select Department",
                    choices: departmentArray                    
                }
            ])
            .then(answers => {
                //Inserting new value to Role table
                console.log("Creating new Role...\n");
                let depId;
                for (i=0; i< res.length;i++){
                    if (res[i].name === answers.choice) {
                      depId = res[i].id;
                    } 
                 }     
                connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answers.title,
                    salary: parseInt(answers.salary),
                    department_id: depId
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " record inserted!\n");
                    // Call updateProduct AFTER the INSERT completes                
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
    });
}
   

        
    




  start();