// 인증 관련 라우팅
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/kakao', authController.redirectToKakao);
router.get('/kakao/callback', authController.handleKakaoCallback);


module.exports = router;