console.log("Loading app.js...");

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const logsRoutes = require('./routes/logsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const ojtHoursRoutes = require('./routes/ojtHoursRoutes');  // new
const errorHandler = require('./middlewares/errorMiddleware');
const pool = require('./config/db');

const app = express();

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB connected at:', res.rows[0].now);
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
})();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/ojt-hours', ojtHoursRoutes);  // new

app.use(errorHandler);

module.exports = app;