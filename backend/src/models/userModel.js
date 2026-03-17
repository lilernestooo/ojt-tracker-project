const pool = require('../config/db');

const createUser = async ({ name, email, password, role, required_hours, previous_hours }) => { // ← add these
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

    await client.query(
      `INSERT INTO ojt_hours (user_id, required_hours, previous_hours)
       VALUES ($1, $2, $3)`,
      [user.id, required_hours || 600, previous_hours || 0] // ← use the values
    );

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

module.exports = { createUser, getUserByEmail, getUserById };