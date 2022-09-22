const passport = require('passport');

const mongoClient = require('./mongo');

/* 로컬로그인 */
const LocalStrategy = require('passport-local').Strategy;

module.exports = () => {
    /* 로컬 */
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'id',
                passwordField: 'pw',
            },
            async (id, pw, cb) => {
                const client = await mongoClient.connect();
                const userCursor = client.db('Shop').collection('users');
                const idResult = await userCursor.findOne({ id });
                if (idResult !== null) {
                    const result = await userCursor.findOne({
                        id,
                        pw,
                    });
                    if (result !== null) {
                        cb(null, result);
                    } else {
                        cb(null, false, { message: '비밀번호가 다릅니다.' });
                    }
                } else {
                    cb(null, false, { message: '해당 id 가 없습니다.' });
                }
            }
        )
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser(async (id, cb) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('Shop').collection('users');
        const result = await userCursor.findOne({ id });
        if (result !== null) {
            cb(null, result);
        }
    });
}
        
    