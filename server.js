const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const path = require('path');
const authRouter = require('./login/routes/auth');
const authController = require("./login/controllers/authController"); // auth 라우터를 가져옵니다.

const app = express();

// Nunjucks 템플릿 엔진 설정
app.set('view engine', 'njk');
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

// 로그인 후 사용자 정보 가져오는 설정
app.get('/', authController.renderHomePage);

// 서버 시작


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`${PORT}번 포트에서 서버 대기 중입니다.`)
    console.log(`Environment variables: ${JSON.stringify(process.env)}`); // 환경 변수 전체를 출력합니다.

});
