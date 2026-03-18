const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getAttendance,
  getAllTimeHours,
  handleTimeIn,
  handleTimeOut,
  handleMarkAbsent,
} = require("../controllers/attendanceController");

router.use(protect);

router.get("/", getAttendance);
router.get("/all-time-hours", getAllTimeHours); // ← new
router.post("/timein", handleTimeIn);
router.post("/timeout", handleTimeOut);
router.post("/absent", handleMarkAbsent);

module.exports = router;