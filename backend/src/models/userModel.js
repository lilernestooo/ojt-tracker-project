const pool = require('../config/db');

/**
 * Create a new user in the database
 * @param {Object} param0 - User data
 * @param {string} param0.name
 * @param {string} param0.email
 * @param {string} param0.password - Hashed password
 * @param {string} param0.role - Default: 'user'
 * @returns {Object} - Created user { id, name, email, role }
 */
const createUser = async ({ name, email, password, role }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email, role`,
    [name, email, password, role]
  );
  return result.rows[0];
};

/**
 * Get a user by email
 * @param {string} email
 * @returns {Object|null} - User object or null if not found
 */
const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};

/**
 * Get a user by ID
 * @param {number} id
 * @returns {Object|null} - User object { id, name, email, role } or null if not found
 */
const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, role FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { createUser, getUserByEmail, getUserById };