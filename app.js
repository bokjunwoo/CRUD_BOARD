const express = require('express');

const PORT = process.env.PORT;

/* mongodb */
const mongoClient = require('./routes/mongo');

/* express-session */
const session = require('express-session');

/* dotenv */
require('dotenv').config();

const app = express();

app.use(
    session({
        secret: 'JUNU',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60,
        },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));


/* routes */
const router = require('./routes/index');
app.use('/', router);
/* 회원가입 */
const signupRouter = require('./routes/signup');
app.use('/signup', signupRouter);
/* 로그인 */
const loginRouter = require('./routes/login');
app.use('/login', loginRouter.router);
/* 게시판 */
const boardRouter = require('./routes/board');
app.use('/board', boardRouter);

/* start */
app.listen(PORT, () => {
      console.log(`해당 포트는 ${PORT}에서 작동중 입니다.`);
});
    