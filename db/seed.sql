USE employee_tracker_db;

INSERT INTO department (name)
VALUES ("Operations"),("Development"),("Marketing"),("Accounting");

INSERT INTO role (title,salary,department_id)
VALUES ("Implementation Manager","80000",1),
       ("Solution Arquitec","140000",1),
       ("Operation Manager","80000",1),
       ("Director of Marketing","90000",3),
       ("Chief Development Officer","120000",2),
       ("Controller","120000",4),
       ("Junior Accountant","80000",4);

INSERT INTO employee (first_name,last_name,role_id)
VALUES ("Augusto","Martinez",2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Cesar","Martinez",1,1);







      

