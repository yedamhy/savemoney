const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const path = require('path');
const authRouter = require('./routes/auth'); // auth 라우터를 가져옵니다.

const app = express();

// Nunjucks 템플릿 엔진 설정
app.set('view engine', 'html');
nunjucks.configure('assets', {
    express: app,
    autoescape: true
});

// 정적 파일 제공을 위한 설정
app.use(express.static(path.join(__dirname, 'assets')));

// 세션 설정
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'ras',
    secure: false
}));

// 라우터 설정
app.use('/auth', authRouter); // auth 경로 설정

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});

// 서버 시작
app.listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중입니다.');
});
