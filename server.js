const mysql = require('mysql2');
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

console.log(`
                ╔═╗┌┬┐┌─┐┬  ┌─┐┬ ┬┌─┐┌─┐  ╔╦╗┬─┐┌─┐┌─┐┬┌─┌─┐┬─┐
                ║╣ │││├─┘│  │ │└┬┘├┤ ├┤    ║ ├┬┘├─┤│  ├┴┐├┤ ├┬┘
                ╚═╝┴ ┴┴  ┴─┘└─┘ ┴ └─┘└─┘   ╩ ┴└─┴ ┴└─┘┴ ┴└─┘┴└─
`);

const userPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'Please choose an action.',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'cancel'
            ]
        }
    ])
        .then((choice) => {
            const { choices } = choice;

            if (choices === 'view all departments') {
                viewDpts();
            }
            if (choices === 'view all roles') {
                viewRoles();
            }
            if (choices === 'view all employees') {
                viewEmps();
            }
            if (choices === 'add a department') {
                addDpt();
            }
            if (choices === 'add a role') {
                addRole();
            }
            if (choices === 'add an employee') {
                addEmp();
            }
            if (choices === 'update an employee role') {
                updateEmp();
            }
            if (choices === 'cancel') {
                db.end(
                    console.log(`
                    ╔═╗┌─┐┌─┐  ┬ ┬┌─┐┬ ┬  ┬  ┌─┐┌┬┐┌─┐┬─┐┬
                    ╚═╗├┤ ├┤   └┬┘│ ││ │  │  ├─┤ │ ├┤ ├┬┘│
                    ╚═╝└─┘└─┘   ┴ └─┘└─┘  ┴─┘┴ ┴ ┴ └─┘┴└─o
                    `)
                );
            };
        });
};

viewDpts = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};

viewRoles = () => {
    const sql = `SELECT role.id, role.title, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};

viewEmps = () => {
    const sql = `SELECT employee.id, 
                      employee.first_name, 
                      employee.last_name, 
                      role.title, 
                      department.name AS department,
                      role.salary, 
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager
                      FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id
                      LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};

userPrompt();

db.connect(err => {
    if (err) throw err;
    console.log('Database connection successful.');
});