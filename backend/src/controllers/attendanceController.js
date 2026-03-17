const attendanceModel = require("../models/attendanceModel");

const getAttendance = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query;

  try {
    const data = await attendanceModel.getAttendanceByMonth(userId, month);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

const handleTimeIn = async (req, res) => {
  const userId = req.user.id;
  try {
    const data = await attendanceModel.timeIn(userId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Time In failed" });
  }
};

const handleTimeOut = async (req, res) => {
  const userId = req.user.id;
  try {
    const data = await attendanceModel.timeOut(userId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Time Out failed" });
  }
};

const handleMarkAbsent = async (req, res) => {
  const userId = req.user.id;
  const { date } = req.body;

  try {
    const data = await attendanceModel.markAbsent(userId, date);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Mark Absent failed" });
  }
};

module.exports = { getAttendance, handleTimeIn, handleTimeOut, handleMarkAbsent };