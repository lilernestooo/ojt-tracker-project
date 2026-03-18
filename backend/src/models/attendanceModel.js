const pool = require("../config/db");

const getAttendanceByMonth = async (userId, month) => {
  const res = await pool.query(
    `SELECT date, status, time_in, time_out, hours_worked 
     FROM attendance 
     WHERE user_id = $1 AND to_char(date, 'YYYY-MM') = $2 
     ORDER BY date ASC`,
    [userId, month]
  );
  return res.rows;
};

const getAllTimeHours = async (userId) => {
  const res = await pool.query(
    `SELECT COALESCE(SUM(hours_worked), 0) AS total_hours
     FROM attendance
     WHERE user_id = $1 AND status = 'present'`,
    [userId]
  );
  return parseFloat(res.rows[0].total_hours);
};

const timeIn = async (userId) => {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

  const res = await pool.query(
    `INSERT INTO attendance (user_id, date, time_in, status)
     VALUES ($1, $2, CURRENT_TIMESTAMP, 'present')
     ON CONFLICT (user_id, date) DO UPDATE
     SET time_in = CURRENT_TIMESTAMP, status = 'present'
     RETURNING date, status, time_in, time_out, hours_worked`,
    [userId, today]
  );

  return res.rows[0];
};

const timeOut = async (userId) => {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });

  const res = await pool.query(
    `UPDATE attendance
     SET time_out = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND date = $2
     RETURNING date, status, time_in, time_out, hours_worked`,
    [userId, today]
  );

  const record = res.rows[0];
  if (!record) return null;

  const diffMinutes = (new Date(record.time_out) - new Date(record.time_in)) / 1000 / 60;
  const hoursWorked = Math.min(diffMinutes / 60, 8).toFixed(2);

  const updated = await pool.query(
    `UPDATE attendance
     SET hours_worked = $1
     WHERE user_id = $2 AND date = $3
     RETURNING date, status, time_in, time_out, hours_worked`,
    [hoursWorked, userId, today]
  );

  return updated.rows[0];
};

const markAbsent = async (userId, date) => {
  const res = await pool.query(
    `INSERT INTO attendance (user_id, date, status, hours_worked)
     VALUES ($1, $2, 'absent', 0)
     ON CONFLICT (user_id, date) DO UPDATE
     SET status = 'absent', hours_worked = 0
     RETURNING date, status, time_in, time_out, hours_worked`,
    [userId, date]
  );

  return res.rows[0];
};

module.exports = { getAttendanceByMonth, getAllTimeHours, timeIn, timeOut, markAbsent };