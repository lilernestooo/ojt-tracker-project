const userService = require('../services/userService');
const userModel = require('../models/userModel');

const register = async (req, res, next) => {
  try {
    if (!req.body) return res.status(400).json({ success: false, message: 'Request body is missing' });
    const user = await userService.registerUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    if (!req.body) return res.status(400).json({ success: false, message: 'Request body is missing' });
    const result = await userService.loginUser(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const user = await userService.getUserProfile(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// Admin — get all interns
const getAllInterns = async (req, res, next) => {
  try {
    const interns = await userModel.getAllInterns();
    res.json({ success: true, data: interns });
  } catch (err) {
    next(err);
  }
};

// Admin — get intern attendance by month
const getInternAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { month } = req.query;
    const data = await userModel.getInternAttendance(id, month);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Admin — get intern logs
const getInternLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await userModel.getInternLogs(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Admin — delete intern
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userModel.deleteUser(id);
    res.json({ success: true, message: 'Intern deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, getAllInterns, getInternAttendance, getInternLogs, deleteUser, updateInternOjtHours, };