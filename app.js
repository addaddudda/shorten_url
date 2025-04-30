const express = require('express');
const app = express();
const db = require('./db');
app.listen(80, () => {
    console.log('http://localhost:80');
})
app.get('/', (req, res) => {
    db.query('SELECT * FROM board', (err, results) => {
        if(err) throw err;
        res.send(results);
    })
})