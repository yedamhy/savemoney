const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');
const express = require('express');

const app = express();
const nunjucks = require('nunjucks');
const session = require('express-session');

app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
})

app.use(session({
    resave:true,
    secret:'ras',
    secure:false,
    saveUninitialized:false,
}))//세션을 설정할 때 쿠키가 생성된다.&&req session의 값도 생성해준다. 어느 라우터든 req session값이 존재하게 된다.

const kakao = {
    clientID:'5baab2d43a20bfe012d6a7adafdbd477',
    clientSecret:'\t3vXooJjwRZeKlqnHuqqcrYuhQ1hjuR3J',
    redirectUrl: 'http://localhost:8080/auth/kakao/callback'
}

//profile account_email
app.get('/auth/kakao',(req,res)=>{
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_url=${kakao.redirectUrl}&response_type=code&scope=profile,account_email`;
    res.redirect(kakaoAuthURL);
})

http.createServer(async (req, res) => {
    try {
        // URL에서 요청된 경로를 파싱합니다.
        const reqPath = url.parse(req.url).pathname;
        // 루트 경로('/')의 요청을 'index.html'로 매핑합니다.
        const filePath = path.join(__dirname, reqPath === '/' ? 'index.html' : reqPath);
        const ext = path.extname(filePath);

        let contentType = 'text/html';
        // 파일 확장자에 따라 Content-Type을 결정합니다.
        switch (ext) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            // 필요한 다른 MIME 타입을 추가할 수 있습니다.
        }

        const data = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
        res.end(data);
    } catch (err) {
        console.error(err);
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
    }
})
    .listen(8080, () => {
        console.log('8080번 포트에서 서버 대기 중입니다.');
    });
