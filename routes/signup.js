const express = require('express');

const router = express.Router();

const mongoClient = require('./mongo');

router.get('/', (req, res) => {
  res.render('signup')
});

/* 아이디 중복 검사 */
router.post('/id', async (req, res) => {
    const client = await mongoClient.connect();
    const userCursor = client.db('Shop').collection('users');
    const duplicatedId = await userCursor.findOne({ id: req.body.id });

    // 중복이 아닌경우
    if (duplicatedId === null) {
        res.send('사용가능한 아이디 입니다');
        res.status(200);
    // 중복된 경우
    } else {
        res.send('이미 사용중이거나 탈퇴한 아이디입니다.');
        res.status(300);
    };
});

/* 닉네임 중복 검사 */
router.post('/name', async (req, res) => {
    const client = await mongoClient.connect();
    const userCursor = client.db('Shop').collection('users');
    const duplicatedName = await userCursor.findOne({ name: req.body.name });

    // 중복이 아닌경우
    if (duplicatedName === null) {
        res.send('사용가능한 닉네임 입니다');
        res.status(200);
    // 중복된 경우
    } else {
        res.send('이미 사용중이거나 탈퇴한 닉네임입니다.');
        res.status(300);
    };
});

/* 회원가입 POST */
router.post('/', async (req, res) => {
    const client = await mongoClient.connect();
    const userCursor = client.db('Shop').collection('users');
    const duplicated = await userCursor.findOne({ 
        id: req.body.id,
        name: req.body.name,
    });

    // 중복이 아닌경우
    if (duplicated === null) {
        const result = await userCursor.insertOne({
            id: req.body.id,
            pw: req.body.pw,
            name: req.body.name,
        });
        if (result.acknowledged) {
            res.status(200);
            res.redirect('/')
        } else {
            res.status(500);
            res.redirect('/')
        }
    // 중복된 경우
    } else {
        res.status(300);
        res.redirect('/')
    }
});

module.exports = router;