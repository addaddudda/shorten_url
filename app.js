const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const db = require('./db');
const { nanoid } = require('nanoid');
const session = require('express-session');
app.set('view engine', 'pug');
app.use(session({
    secret: 'root', // 비밀 키 설정
    resave: false,
    saveUninitialized: true
}));
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
                db.query('INSERT INTO users (id, password) VALUES (?, ?)', [id, password], (err, results) => {
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
            req.session.user = results[0];
            res.redirect('http://localhost:80/');
        }
        else{
            res.render('login2');
        }
    })
})
// shorten url먼저 개발
app.get('/shorturl', (req, res) => {
    if(!req.session.user){
        res.send('먼저 로그인 또는 회원가입을 해주세요! <p> <a href="http://localhost:80/login">로그인 주소</a> <p> <a href="http://localhost:80/signin">회원가입 주소</a>');
    }else {
        res.render('shortenurl');
    }
})
app.post('/shorturl', (req, res) => {
    let url = req.body.url;
    let shorturl = nanoid(10)
    db.query('INSERT INTO url (url, shorturl) VALUES (?, ?)',  [url, shorturl], (err, results) => {
        if(err) throw err;
        res.send('줄이기 완료! <p>줄인 url: ' + shorturl + '<p><a href="http://localhost:80/">메인으로 돌아가기</a>');
    })
})
app.get('/shorturl/:url', (req, res) => {
    let url = req.params.url;
    db.query('SELECT * FROM url WHERE shorturl=?', [url], (err, results) => {
        if(err) throw err;
        else if(results.length > 0){
            res.redirect(results[0].url);
        }else {
            res.send('잘못된 url입니다!');
        }
    })
})
app.get('/findurl', (req, res) => {
    res.render('findurl');
})