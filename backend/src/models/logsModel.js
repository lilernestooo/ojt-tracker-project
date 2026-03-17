const pool = require('../config/db');

const getAllLogs = async (user_id) => {
  const res = await pool.query(
    'SELECT * FROM logs WHERE user_id = $1 ORDER BY id DESC',
    [user_id]
  );
  return res.rows;
};

const getLogById = async (id) => {
  const res = await pool.query('SELECT * FROM logs WHERE id = $1', [id]);
  return res.rows[0];
};

const createLog = async ({ title, description, date, user_id }) => {
  const res = await pool.query(
    'INSERT INTO logs (title, description, date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, description, date, user_id]
  );
  return res.rows[0];
};

const updateLog = async (id, { title, description, date }) => {
  const res = await pool.query(
    'UPDATE logs SET title = $1, description = $2, date = $3 WHERE id = $4 RETURNING *',
    [title, description, date, id]
  );
  return res.rows[0];
};

const deleteLog = async (id) => {
  const res = await pool.query(
    'DELETE FROM logs WHERE id = $1 RETURNING *',
    [id]
  );
  return res.rows[0];
};

module.exports = { getAllLogs, getLogById, createLog, updateLog, deleteLog };