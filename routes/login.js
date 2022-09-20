const express = require('express');

const router = express.Router();

const mongoClient = require('./mongo');

/* 로그인여부 미들웨어 */
const isLogin = (req, res, next) => {
    if (req.session.login) {
        next();
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write(`<script>alert('로그인이 필요합니다.')</script>`);
        res.write("<script>window.location=\"/login\"</script>");
    };
}

/* 로그인 GET */
router.get('/', (req, res) => {
  res.render('login')
});

/* 로그인 POST */
router.post('/', async (req, res) => {
    const client = await mongoClient.connect();
    const userCursor = client.db('Shop').collection('users');
    const idResult = await userCursor.findOne({
        id: req.body.id,
        pw: req.body.pw,
    });
    if (idResult !== null) {
        req.session.login = true;
        req.session.userId = req.body.id;
        res.status(200);
        res.redirect('/')
        console.log(req.session.userName)
    } else {
        res.status(404);
    }
});

/* 로그아웃 GET */
router.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});
    

module.exports = { router, isLogin };