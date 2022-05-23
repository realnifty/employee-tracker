const mysql = require('mysql2');
const db = require('./db/connection');
const cTable = require('console.table');

db.connect(err => {
    if (err) throw err;
    console.log('Database connection successful.');
});