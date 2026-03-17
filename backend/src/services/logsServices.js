// src/services/logsServices.js
const logsModel = require('../models/logsModel');

const getLogs = async (user_id) => {
  return await logsModel.getAllLogs(user_id);
};

const createLog = async (data) => {
  return await logsModel.createLog(data);
};

const updateLog = async (id, data) => {
  return await logsModel.updateLog(id, data);
};

const deleteLog = async (id) => {
  return await logsModel.deleteLog(id);
};

module.exports = {
  getLogs,
  createLog,
  updateLog,
  deleteLog,
};