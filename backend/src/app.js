console.log("Loading app.js...");
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const pool = require('./config/db');

const app = express();

// Test DB connection safely
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB connected at:', res.rows[0].now);
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
})();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorHandler);

module.exports = app;