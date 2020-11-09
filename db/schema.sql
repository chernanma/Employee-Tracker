-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS employee_tracker_db;

-- Created the DB "wizard_schools_db" (only works on local connections)
CREATE DATABASE employee_tracker_db;

-- Use the DB wizard_schools_db for all the rest of the script
USE employee_tracker_db;

-- Created the table "deparment"
CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);

-- Created the table "role"
CREATE TABLE role (
  id int AUTO_INCREMENT NOT NULL, 
  title varchar(30) NOT NULL, 
  salary decimal(10,4) NOT NULL,
  department_id int NOT NULL, 
  PRIMARY KEY(id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);


-- Created the table "employee"
CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,  
  role_id int NOT NULL,
  manager_id int,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);



