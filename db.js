const mysql = require('mysql2');
const pool = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'root',
    database: 'learn'
});

module.exports = pool;