const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,       // e.g., ojt_user
  host: process.env.DB_HOST,       // e.g., localhost
  database: process.env.DB_NAME,   // e.g., ojt_tracker
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

pool.on('error', (err) => {
  console.error('Unexpected DB error', err);
  process.exit(-1);
});

module.exports = pool;