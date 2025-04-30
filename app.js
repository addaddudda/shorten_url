const express = require('express');
const app = express();
const db = require('./db');
app.listen(80, () => {
    console.log('http://localhost:80');
})
