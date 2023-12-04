module.exports = {
  userList: `select * from user_table`,
  userInsert: `insert into user_table set ?`,
  userDelete : `DELETE FROM user_table WHERE kakao_id = ?`,
  checkIdDupli : 'SELECT COUNT(*) AS count FROM user_table WHERE kakao_id = ?',

  postInsert: `INSERT INTO post (date, price, text) VALUES (?, ?, ?)`,
  postList: `SELECT * FROM post`,

  calendarFind: `select * from post where date = ?`,
  calendarInsert: `INSERT INTO calendar_table (success_date) VALUES (?)`,

  // 임시로 과제에 사용했던 거 넣어둠
  // 이게 아마 개 많을 것으로 예상
};
