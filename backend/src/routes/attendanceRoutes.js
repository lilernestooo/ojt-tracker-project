const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getAttendance,
  handleTimeIn,
  handleTimeOut,
  handleMarkAbsent,
} = require("../controllers/attendanceController");

router.use(protect); // Protect all routes

router.get("/", getAttendance);           // GET /attendance?month=YYYY-MM
router.post("/timein", handleTimeIn);     // POST /attendance/timein
router.post("/timeout", handleTimeOut);   // POST /attendance/timeout
router.post("/absent", handleMarkAbsent); // POST /attendance/absent

module.exports = router;