const ojtHoursModel = require('../models/ojtHoursModel');

const getOjtHours = async (req, res, next) => {
  try {
    const data = await ojtHoursModel.getOjtHours(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updateOjtHours = async (req, res, next) => {
  try {
    const { required_hours, previous_hours } = req.body;
    const data = await ojtHoursModel.updateOjtHours({
      user_id: req.user.id,
      required_hours,
      previous_hours,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOjtHours, updateOjtHours };