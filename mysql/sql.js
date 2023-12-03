module.exports = {
  userList: `select * from userTable`,
  userInsert: `insert into userTable set ?`,
  postInsert: `INSERT INTO post (date, price, text) VALUES (?, ?, ?)`,
  postList: `SELECT * FROM post`,

  calendarFind: `select * from post where date = ?`,
  calendarInsert: `INSERT INTO calendar_table (success_date) VALUES (?)`,
  // 임시로 과제에 사용했던 거 넣어둠
  // 이게 아마 개 많을 것으로 예상
};
