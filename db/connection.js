const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: process.env.DB_PASSWORD,
    database: 'employee'
});

module.exports = db;