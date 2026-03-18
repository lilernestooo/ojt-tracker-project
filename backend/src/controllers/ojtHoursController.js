const ojtHoursModel = require('../models/ojtHoursModel');

const getOjtHours = async (req, res, next) => {
  try {
    const data = await ojtHoursModel.getOjtHours(req.user.id);
    
    // FIX: Check if data is an array. If it is, grab the first row. 
    // If it's already an object, or null, leave it as is.
    const formattedData = Array.isArray(data) ? data[0] : data;
    
    // Fallback defaults just in case the user has no DB row yet
    res.json({ 
      success: true, 
      data: formattedData || { required_hours: 600, previous_hours: 0 } 
    });
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