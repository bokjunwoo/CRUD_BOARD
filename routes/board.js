const express = require('express');

const router = express.Router();

const mongoClient = require('./mongo');

const isLogin = require('./login');

/* 게시판 GET */
router.get('/', async (req, res) => {
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    const ARTICLE = await cursor.find().sort({'_id':-1}).toArray();
    const articleLen = ARTICLE.length;
    res.render('board', {
        ARTICLE,
        articleCounts: articleLen,
        userId: req.session.userId,
    });

});

/* 글작성 GET */
router.get('/write', isLogin.isLogin, (req, res) => {
      res.render('board_write');
});

// 글 작성 POST
// router.post('/write', async (req, res) => {
//     if (req.body.title && req.body.content) {
//         const newArticle = {
//             id: req.session.userId,
//             title: req.body.title,
//             content: req.body.content,
//         };
//         const client = await mongoClient.connect();
//         const cursor = client.db('Shop').collection('board');
//         await cursor.insertOne(newArticle);
//         res.redirect('/board');
//     }
// });

/* 글작성 POST */
// router.post('/write', isLogin.isLogin, async (req, res) => {
//     const client = await mongoClient.connect();
//     const cursor = client.db('Shop').collection('counter');
//     await cursor.findOne({name: 'listTotal'}, function(err, result){
//         const allPost = result.totalPost;

//         const savePost = {
//             _id: allPost + 1,
//             id: req.session.userId,
//             title: req.body.title,
//             content: req.body.content,
//         }

//         const cursor1 = client.db('Shop').collection('board');
//         cursor1.insertOne(savePost, (err, result) => {

//             cursor.updateOne({name: 'listTotal'},{$inc:{totalPost:1}}, (err, result) => {
//                 if(err) {
//                     return console.log('err')
//                 }
//             })
//         })
//     });
//     res.redirect('/board');
// });
router.post('/write', isLogin.isLogin, async (req, res) => {
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('counter');
    const cursor2 = client.db('Shop').collection('users');
    await cursor.findOne({name: 'listTotal'}, function(err, result){
        const allPost = result.totalPost;

        const savePost = {
            _id: allPost + 1,
            id: req.session.userId,
            title: req.body.title,
            content: req.body.content,
            name: req.session.userName,
        }

        const cursor1 = client.db('Shop').collection('board');
        cursor1.insertOne(savePost, (err, result) => {

            cursor.updateOne({name: 'listTotal'},{$inc:{totalPost:1}}, (err, result) => {
                if(err) {
                    return console.log('err')
                }
            })
        })
    });
    res.redirect('/board');
});

/* 자세히보기 GET */
router.get('/detail/:id', async (req, res) => {
    req.params.id = parseInt(req.params.id);
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    const ARTICLE = await cursor.findOne({ _id : req.params.id });

    res.render('board_detail', { 
        ARTICLE,
        userId: req.session.userId,
    });
});

/* 수정하기 GET */
router.get('/emend/:id', isLogin.isLogin, async (req, res) => {
    req.params.id = parseInt(req.params.id);
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    const selectedArticle = await cursor.findOne({ _id : req.params.id });
    
    res.render('board_emend', { selectedArticle });
});

/* 수정하기 POST */
router.post('/emend/:id', isLogin.isLogin, async (req, res) => {
    if (req.body.title && req.body.content) {
        const client = await mongoClient.connect();
        const cursor = client.db('Shop').collection('board');
        await cursor.updateOne(
            { _id : req.params.id },
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                },
            }
        );
        res.redirect('/board');
    };
});

/* 삭제하기 DELETE */
router.delete('/delete/:id', isLogin.isLogin, async (req, res) => {
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    // 예외처리
    const result = await cursor.deleteOne({ _id: req.params.id });
    if (result.acknowledged) {
      res.send('삭제완료');
    } else {
      const err = new Error('삭제 실패');
      err.statusCode = 404;
      throw err;
    }
});
    
module.exports = router;