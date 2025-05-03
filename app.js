const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const db = require('./db');
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
        db.query('SELECT * FROM users WHERE id=?', [id], (err, results) => {
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
app.post('/login', (req, res) => {
    let id = req.body.id;
    let password = req.body.password;
    db.query('SELECT * FROM users WHERE id=? AND password=?', [id, password], (err, results) => {
        if(err) throw err;
        else if(results.length > 0){
            res.send('로그인 완료! <p> <a href="http://localhost:80/">메인으로 돌아가기기</a>')
        }
        else{
            res.send('아이디 또는 비밀번호가 다릅니다 <p> <a href="http://localhost:80/login">로그인 화면으로 돌아가기</a>');
        }
    })
}) //만들어야할것: 비밀번호 보기
// shorten url먼저 개발
