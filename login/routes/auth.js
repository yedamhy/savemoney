// 인증 관련 라우팅
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/kakao", authController.redirectToKakao);
router.get("/kakao/callback", authController.handleKakaoCallback);
router.get("/logout", authController.logoutFromKakao);
router.get("/unlink", authController.unlinkKakaoAccount);
router.get("/challenge", function (req, res, next) {
  res.render("challenge.html");
});

module.exports = router;
