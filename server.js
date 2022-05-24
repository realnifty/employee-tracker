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

addEmp = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Please enter a first name for this employee.'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Please enter a last name for this employee.'
        }
    ])
        .then(input => {
            const params = [input.first_name, input.last_name];

            const assign_role = `SELECT role.id, role.title FROM role`;

            db.query(assign_role, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'assignRole',
                        message: 'Please select a role for this employee.',
                        choices: roles
                    }
                ])
                    .then(input => {
                        const role = input.assignRole;

                        params.push(role);

                        const assign_manager = `SELECT * FROM employee`;

                        db.query(assign_manager, (err, data) => {
                            if (err) throw err;
                            const managers = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'selectManager',
                                    message: 'Please select a manager for this employee.',
                                    choices: managers
                                }
                            ])
                                .then(input => {
                                    const manager = input.selectManager;
                                    params.push(manager);

                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`

                                    db.query(sql, params, (err, result) => {
                                        if (err) throw err;

                                        console.log(`Employee added.`);
                                        viewEmps();
                                    })
                            })
                        })
                })
            })
    })
}

updateEmp = () => {
    const employee_sql = `SELECT * FROM employee`;

    db.query(employee_sql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeSelect',
                message: 'Please select an employee to update.',
                choices: employees
            }
        ])
            .then(input => {
                const employee = input.employeeSelect;
                const params = [];

                params.push(employee);

                const role_sql = `SELECT * FROM role`;

                db.query(role_sql, (err, data) => {
                    if (err) throw err;
                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'updateRole',
                            message: 'Please select a new role for this employee.',
                            choices: roles
                        }
                    ])
                        .then(input => {
                            const newRole = input.updateRole;
                            params.push(newRole);

                            var employee = params[0]
                            params[0] = newRole
                            params[1] = employee

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`

                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log('Employee updated.')

                                viewEmps();
                            })
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