const pool = require("../config/db");

const getAttendanceByMonth = async (userId, month) => {
  const res = await pool.query(
    "SELECT date, status, time_in, time_out FROM attendance WHERE user_id = $1 AND to_char(date, 'YYYY-MM') = $2 ORDER BY date ASC",
    [userId, month]
  );
  return res.rows;
};

const timeIn = async (userId) => {
  const today = new Date().toISOString().split("T")[0];

  // Insert if not exists, else update time_in
  const res = await pool.query(
    `INSERT INTO attendance (user_id, date, time_in, status)
     VALUES ($1, $2, CURRENT_TIMESTAMP, 'present')
     ON CONFLICT (user_id, date) DO UPDATE
     SET time_in = CURRENT_TIMESTAMP, status = 'present'
     RETURNING date, status, time_in, time_out`,
    [userId, today]
  );

  return res.rows[0];
};

const timeOut = async (userId) => {
  const today = new Date().toISOString().split("T")[0];

  const res = await pool.query(
    `UPDATE attendance
     SET time_out = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND date = $2
     RETURNING date, status, time_in, time_out`,
    [userId, today]
  );

  return res.rows[0];
};

const markAbsent = async (userId, date) => {
  const res = await pool.query(
    `INSERT INTO attendance (user_id, date, status)
     VALUES ($1, $2, 'absent')
     ON CONFLICT (user_id, date) DO UPDATE
     SET status = 'absent'
     RETURNING date, status, time_in, time_out`,
    [userId, date]
  );

  return res.rows[0];
};

module.exports = { getAttendanceByMonth, timeIn, timeOut, markAbsent };