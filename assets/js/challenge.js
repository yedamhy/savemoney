const express = require("express");
const router = require("../../login/routes/auth");
const fs = require("fs");
const db = require("../../mysql/index");
const bodyParser = require("body-parser");

router.post("/challenge", async (req, res) => {
  try {
    const { date } = req.body;

    // 데이터베이스에서 클릭한 날짜에 해당하는 price 값 가져오기
    const result = await db.query("calendarFind", [date]);

    // price 값을 더하기
    const totalPrice = result.reduce((acc, entry) => acc + entry.price, 0);

    // 10000원 초과인지 여부 확인
    const isOver10000 = totalPrice > 10000;

    // 응답으로 전송할 데이터
    const responseData = {
      totalPrice,
      isOver10000,
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 챌린지 성공 날짜 db에 저장하기 -> 이 갯수로 등급 설정하면 될듯
router.post("/challenge/save", async (req, res) => {
  try {
    const { successDate } = req.body;
    const result = await db.query("calendarInsert", [successDate]);
    res.status(200).json({ message: "올ㅋ 챌린지 도전에 성공하셨습니다." });
  } catch (error) {
    // 에러가 발생한 경우 클라이언트에 에러 응답
    console.error("Error saving challenge stamp:", error);
    res
      .status(500)
      .json({ error: "챌린지 도장을 저장하는 중에 오류가 발생했습니다." });
  }
});

module.exports = router;
