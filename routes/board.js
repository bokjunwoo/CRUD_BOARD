const express = require('express');

const router = express.Router();

const mongoClient = require('./mongo');

const isLogin = require('./login');

const multer = require('multer');

const fs = require('fs');

const dir = './uploads';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now());
    },
});

const limits = {
    fileSize: 1024 * 1024 * 2,
};

const upload = multer({ storage, limits });

/* 게시판 GET */
router.get('/', async (req, res) => {
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    const total = await client.db('Shop').collection('board').count();

    // 페이지에 보여줄 게시글의 수
    const viewPage = 10;
    // 페이지에 표시할 페이지의 수
    const maxPage = 5;
    // 전체 페이지의 수
    const totalPage = Math.ceil(total / viewPage);
    // 현재 페이지수 가져오기 없으면 1
    const pageNumber = (req.query.page === null) ? 1 : req.query.page;
    // URL로 페이지 수보다 높은 값을 입력할 때 마지막페이지를 보여준다
    if (pageNumber > totalPage) {
        pageNumber = totalPage;
    }
    // 스킵할 페이지
    const skipPage = (pageNumber - 1) * viewPage;
    // 페이지에 표시할 시작번호
    const startPage = Math.floor(((pageNumber - 1) / maxPage)) * maxPage + 1;
    // 페이지에 표시할 마지막번호
    let endPage = startPage + maxPage - 1;
    // 마지막 페이지가 전체페이지보다 클 때 전체값으로 출력
    if (endPage > totalPage) { 
        endPage = totalPage;
    }

    const ARTICLE = await cursor.find({}).sort({ "_id" : -1 }).skip(skipPage).limit(viewPage).toArray();
    const articleLen = ARTICLE.length;

    res.render('board', {
        viewPage,
        totalPage,
        maxPage,
        startPage,
        endPage,
        ARTICLE,
        articleCounts: articleLen,
        userId: req.session.userId,
    });  
});
// router.get('/', async (req, res) => {
//     const client = await mongoClient.connect();
//     const cursor = client.db('Shop').collection('board');
//     const ARTICLE = await cursor.find().sort({'_id':-1}).toArray();
//     c
//     res.render('board', {
//         ARTICLE,
//         articleCounts: articleLen,
//         userId: req.session.userId,
//     });
// });

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
router.post('/write', isLogin.isLogin, upload.single('img'), async (req, res) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    console.log(req.file);
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('counter');
    await cursor.findOne({name: 'listTotal'}, function(err, result){
        const allPost = result.totalPost;
        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const hours = ('0' + today.getHours()).slice(-2);
        const minutes = ('0' + today.getMinutes()).slice(-2);

        const time = hours + ':' + minutes;
        const dateFull = year + '.' + month + '.' + day + ' ' + hours + ':' + minutes;

        const savePost = {
            num: allPost + 1,
            id: req.session.userId,
            name: req.session.userName,
            title: req.body.title,
            content: req.body.content,
            time,
            dateFull,
            view: 0,
            star: 0,
            img: req.file ? req.file.filename : null,
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
    res.redirect('/board?page=1');
});

/* 자세히보기 GET */
router.get('/detail/:id', async (req, res) => {
    req.params.id = parseInt(req.params.id);
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    const ARTICLE = await cursor.findOne({ num : req.params.id});
    
    await cursor.updateOne(
        { num : req.params.id },
        {
            $inc: { view : 1 },
        }
    );
    res.render('board_detail', { 
        ARTICLE,
        userId: req.session.userId,
    });
}); 

router.post("/detail/star", async (req, res) => {
    req.body.articleNum = parseInt(req.body.articleNum);
    const client = await mongoClient.connect();
    const cursor = client.db("Shop").collection("board");
    
    await cursor.updateOne(
        { num: req.body.articleNum },
        {
            $inc: { star : 1 },
        }
    );
    res.status(200).send("삭제 성공");
});

/* 자세히보기 -> 댓글 POST */
router.post('/detail/:id', async (req, res) => {
    req.params.id = parseInt(req.params.id);
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    const today = new Date();
    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2); 
    const timeHM = hours + ':' + minutes;
    const timeHMS = hours + ':' + minutes + ':' + seconds;

    await cursor.updateOne(
        { num : req.params.id },
        {
            $push: {
                comment: {
                    comment: req.body.comment,
                    userId: req.session.userId,
                    timeHM,
                    timeHMS,
                }
            },
        }
    );
    res.redirect('/board')
});

/* 댓글 삭제하기 DELETE */
router.delete("/delete/comment", async (req, res) => {
    req.body.articleNum = parseInt(req.body.articleNum);
    const client = await mongoClient.connect();
    const cursor = client.db("Shop").collection("board");
    
    await cursor.updateOne(
        { num: req.body.articleNum },
        {
            $pull: {
                comment: {
                    timeHMS: req.body.commentTime,
                },
            },
        }
    );
    res.status(200).send("삭제 성공");
});

/* 수정하기 GET */
router.get('/emend/:id', isLogin.isLogin, async (req, res) => {
    req.params.id = parseInt(req.params.id);
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    const selectedArticle = await cursor.findOne({ num : req.params.id });
    
    res.render('board_emend', { selectedArticle });
});

/* 수정하기 POST */
router.post('/emend/:id', isLogin.isLogin, async (req, res) => {
    if (req.body.title && req.body.content) {
        req.params.id = parseInt(req.params.id);
        const client = await mongoClient.connect();
        const cursor = client.db('Shop').collection('board');
        await cursor.updateOne(
            { num : req.params.id },
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
    req.params.id = parseInt(req.params.id);
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    // 예외처리
    const result = await cursor.deleteOne({ num : req.params.id });
    if (result.acknowledged) {
      res.send('삭제완료');
    } else {
      const err = new Error('삭제 실패');
      err.statusCode = 404;
      throw err;
    }
});

/* 검색기능 */
router.get('/search', async (req, res) => {
    const search = [
        {
            $search: {
                index: 'titleSearch',
                text: {
                    query: req.query.value,
                    path: 'title'
                }
            }
        },
        { $sort : { 
                _id : -1 
            }
        },
    ]
    const client = await mongoClient.connect();
    const cursor = client.db('Shop').collection('board');
    const ARTICLE = await cursor.aggregate(search).toArray();
    const articleLen = ARTICLE.length;

    res.render('board_search', {
        ARTICLE,
        articleCounts: articleLen,
        userId: req.session.userId,
    })
})
    
module.exports = router;