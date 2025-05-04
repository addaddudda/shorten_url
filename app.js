const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const db = require('./db');
const { nanoid } = require('nanoid');
app.set('view engine', 'pug');
app.use(bodyparser.urlencoded({extended:false}));
app.listen(80, () => {
    console.log('http://localhost:80');
})
app.get('/', (req, res) => {
    res.render('index');
})
app.get('/signin', (req, res) => {
    res.render('signin');
})
app.post('/signin', (req, res) => {
    let id = req.body.id;
    let password = req.body.password;
    let checkpassword = req.body.checkpassword;
    if(password != checkpassword){
        res.redirect('http://localhost:80/signin');
    }else{
        db.query('SELECT * FROM users WHERE id=?', [id], async (err, results) => {
            if(err) throw err;
            else if(results.length == 0){
                db.query('INSERT INTO users (id, password ) VALUES (?, ?)', [id, password], (err, results) => {
                    if(err) throw err;
                    res.send('완료!<p><a href="http://localhost:80/"> 메인으로 돌아가기 </a>');  
               })
            }
            else{
                res.send('이미 존재하는 아이디입니다!<p>\n<a href="http://localhost:80/signin">돌아가기</a>');
            }
        })
    }
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login', async (req, res) => {
    let id = req.body.id;
    let password = req.body.password;
    db.query('SELECT * FROM users WHERE id=? AND password=?', [id, password], (err, results) => {
        if(err) throw err;
        else if(results.length > 0){
            res.redirect('http://localhost:80/');
        }
        else{
            res.render('login2');
        }
    })
})
// shorten url먼저 개발
app.get('/shorturl', (req, res) => {
    res.render('shortenurl');
})
app.post('/shorturl', (req, res) => {
    let url = req.body.url;
    let shorturl = nanoid(10)
    db.query('INSERT INTO url (url, shorturl) VALUES (?, ?)',  [url, shorturl], (err, results) => {
        if(err) throw err;
        res.send('줄이기 완료! <p>줄인 url: ' + shorturl + '<p><a href="http://localhost:80/">메인으로 돌아가기</a>');
    })
})
app.get('/:url', (req, res) => {
    let url = req.params.url;
    db.query('SELECT * FROM url WHERE shorturl=?', [url], (err, results) => {
        if(err) throw err;
        let nomalurl = results[0].url;
        res.redirect(nomalurl);
    })
})
