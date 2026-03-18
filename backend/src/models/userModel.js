const pool = require('../config/db');

const createUser = async ({ name, email, password, role, required_hours, previous_hours }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, password, role]
    );
    const user = userResult.rows[0];

    // Only create ojt_hours for interns
    if (role === 'intern') {
      await client.query(
        `INSERT INTO ojt_hours (user_id, required_hours, previous_hours)
         VALUES ($1, $2, $3)`,
        [user.id, required_hours || 600, previous_hours || 0]
      );
    }

    await client.query('COMMIT');
    return user;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, role FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

// Admin — get all interns with their OJT hours
const getAllInterns = async () => {
  const result = await pool.query(
    `SELECT 
      u.id, u.name, u.email, u.role,
      o.required_hours, o.previous_hours
     FROM users u
     LEFT JOIN ojt_hours o ON u.id = o.user_id
     WHERE u.role = 'intern'
     ORDER BY u.name ASC`
  );
  return result.rows;
};

// Admin — get attendance of a specific intern by month
const getInternAttendance = async (userId, month) => {
  const result = await pool.query(
    `SELECT date, status, time_in, time_out, hours_worked
     FROM attendance
     WHERE user_id = $1 AND to_char(date, 'YYYY-MM') = $2
     ORDER BY date ASC`,
    [userId, month]
  );
  return result.rows;
};

// Admin — get logs of a specific intern
const getInternLogs = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM logs WHERE user_id = $1 ORDER BY date DESC`,
    [userId]
  );
  return result.rows;
};

// Admin — delete an intern
const deleteUser = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM attendance WHERE user_id = $1`, [id]);
    await client.query(`DELETE FROM logs WHERE user_id = $1`, [id]);
    await client.query(`DELETE FROM ojt_hours WHERE user_id = $1`, [id]);
    await client.query(`DELETE FROM users WHERE id = $1`, [id]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllInterns,
  getInternAttendance,
  getInternLogs,
  deleteUser,
  updateInternOjtHours,
};