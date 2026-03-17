const pool = require('../config/db');

const createOjtHours = async ({ user_id, required_hours, previous_hours }) => {
  const result = await pool.query(
    `INSERT INTO ojt_hours (user_id, required_hours, previous_hours)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [user_id, required_hours, previous_hours]
  );
  return result.rows[0];
};

const getOjtHours = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM ojt_hours WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0] || null;
};

const updateOjtHours = async ({ user_id, required_hours, previous_hours }) => {
  const result = await pool.query(
    `UPDATE ojt_hours
     SET required_hours = $1, previous_hours = $2
     WHERE user_id = $3
     RETURNING *`,
    [required_hours, previous_hours, user_id]
  );
  return result.rows[0];
};

module.exports = { createOjtHours, getOjtHours, updateOjtHours };