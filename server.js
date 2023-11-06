const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const path = require('path');
const authRouter = require('./login/routes/auth'); // auth 라우터를 가져옵니다.

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

// 메인 페이지
/*
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'index.njk'));
});
*/
// 로그인 정보 처리
app.get('/', (req, res) => {
    let displayNickname = '로그인 해주세요';
    let displayImage = 'img/profile-img.jpg';
    let loggedIn = false;
    let ranking = "Bronze";
    if (req.session.kakao) {
        // 세션에 카카오 정보가 있으면 템플릿 변수로 전달
        displayNickname = req.session.kakao.properties.nickname + '님';
        displayImage = req.session.kakao.properties.thumbnail_image;
        loggedIn = true; // 로그인 상태를 true로 설정

    }

    // 세션 정보가 있으면 닉네임 뒤에 '님'을 붙임, 없으면 '로그인 해주세요'
    res.render('index', {
        nickname: displayNickname,
        user_image: displayImage,
        loggedIn: loggedIn,
        ranking : ranking
    });
});


// 서버 시작
app.listen(8080, () => {
    console.log('8080번 포트에서 서버 대기 중 입니다.');
});
