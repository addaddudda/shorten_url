const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const db = require('./db');
app.set('view engine', 'pug');
app.set('json space', 2);
app.listen(80, () => {
    console.log('http://localhost:80');
})
app.get('/', (req, res) => {
    res.render('index');
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login', (req, res) => {
    
})