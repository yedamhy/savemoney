// Controller 란?
// 요청이 날라오면 Service에게 일을 시키는 계층
// Service가 일을 해오면? 답장하는 계층
const axios = require('axios');
const qs = require('qs');
const kakaoConfig = require('../config/kakao');


exports.redirectToKakao = (req, res) => {
    // 카카오 인증 페이지로 리다이렉트하는 로직
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoConfig.clientID}&redirect_uri=${kakaoConfig.redirectUri}&response_type=code&scope=profile_nickname,profile_image`;
    res.redirect(kakaoAuthURL);
};

exports.handleKakaoCallback = async (req, res) => {
    // 카카오 로그인 콜백 처리 로직
    let token;
    try {
        // 토큰 요청
        token = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                grant_type: 'authorization_code',
                client_id: kakaoConfig.clientID,
                client_secret: kakaoConfig.clientSecret,
                redirect_uri: kakaoConfig.redirectUri,
                code: req.query.code
            })
        });
    } catch (err) {
        return res.status(500).json(err.data);
    }

    let user;

    try {
        // 사용자 정보 요청
        user = await axios({
            method: 'GET',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: `Bearer ${token.data.access_token}`
            }
        });
    } catch (err) {
        return res.status(500).json(err.data);
    }

    req.session.kakao = user.data;
    res.send('로그인 성공!');
};

exports.displayUserInfo = (req, res) => {
    // 사용자 정보 페이지 로직
    const { nickname, profile_image } = req.session.kakao.properties;
    res.render('info', {
        nickname,
        profile_image
    });
};