// backend/src/app.js
console.log("Loading app.js...");

const express = require('express');
const cors = require('cors'); // CORS
const userRoutes = require('./routes/userRoutes');
const logsRoutes = require('./routes/logsRoutes'); 
const attendanceRoutes = require('./routes/attendanceRoutes'); // <-- new
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

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // allow frontend requests
app.use(express.json()); // parse JSON requests

// Routes
app.use('/api/users', userRoutes);       // user auth routes
app.use('/api/logs', logsRoutes);        // logs routes (protected)
app.use('/api/attendance', attendanceRoutes); // attendance routes (protected)

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;