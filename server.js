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

            if (choices === 'view all departments') { }
            
            if (choices === 'view all roles') { }
            
            if (choices === 'view all employees') { }
            
            if (choices === 'add a department') { }
            
            if (choices === 'add a role') { }
            
            if (choices === 'add an employee') { }
            
            if (choices === 'update an employee role') { }
            
            if (choices === 'cancel') { }
    })
}

userPrompt();

db.connect(err => {
    if (err) throw err;
    console.log('Database connection successful.');
});