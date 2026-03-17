// src/controllers/logsController.js
const logsService = require('../services/logsServices');

const getLogs = async (req, res, next) => {
  try {
    // Pass the current user's ID
    const logs = await logsService.getLogs(req.user.id);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

const createLog = async (req, res, next) => {
  try {
    const { title, date } = req.body;
    const user_id = req.user.id; // updated from student_id to user_id
    const newLog = await logsService.createLog({ title, date, user_id });
    res.status(201).json(newLog);
  } catch (err) {
    next(err);
  }
};

const updateLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, date } = req.body;
    const updated = await logsService.updateLog(id, { title, date });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await logsService.deleteLog(id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLogs,
  createLog,
  updateLog,
  deleteLog,
};