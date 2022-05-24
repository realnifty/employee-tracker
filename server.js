const mysql = require('mysql2');
const db = require('./db/connection');
const cTable = require('console.table');
const inquirer = require('inquirer');

const userPrompt = () => {
    console.log(`
                ╔═╗┌┬┐┌─┐┬  ┌─┐┬ ┬┌─┐┌─┐  ╔╦╗┬─┐┌─┐┌─┐┬┌─┌─┐┬─┐
                ║╣ │││├─┘│  │ │└┬┘├┤ ├┤    ║ ├┬┘├─┤│  ├┴┐├┤ ├┬┘
                ╚═╝┴ ┴┴  ┴─┘└─┘ ┴ └─┘└─┘   ╩ ┴└─┴ ┴└─┘┴ ┴└─┘┴└─
`);
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
                'exit'
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
            if (choices === 'exit') {
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

addDpt = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDpt',
            message: 'Please enter a new department name.'
        }
    ])
        .then(input => {
            const sql = `INSERT INTO department (name)
                  VALUES (?)`;
            db.query(sql, input.addDpt, (err, result) => {
                if (err) throw err;
                console.log(`Successfully added ${input.addDpt} to departments.`);
                viewDpts();
            })
        });
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'Please enter a new role.'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Please enter a salary for this role.'
        }
    ])
        .then(input => {
            const params = [input.addRole, input.salary];

            const role_sql = `SELECT name, id FROM department`;

            db.query(role_sql, (err, data) => {
                if (err) throw err;

                const dpt = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'dpt',
                        message: 'Please choose a department for this role.',
                        choices: dpt
                    }
                ])
                    .then(input => {
                        const dpt = input.dpt;
                        params.push(dpt);

                        const sql = `INSERT INTO role (title, salary, department_id)
                                    VALUES (?, ?, ?)`;

                        db.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log(`Added ${input.role} to roles!`);

                            viewRoles();

                        })
                    })
            })
        })
}

userPrompt();

db.connect(err => {
    if (err) throw err;
    console.log('Database connection successful.');
});