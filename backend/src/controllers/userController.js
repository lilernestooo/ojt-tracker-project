const userService = require('../services/userService');

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

module.exports = { register, login, getProfile };