const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getOjtHours, updateOjtHours } = require('../controllers/ojtHoursController');

router.use(protect);

router.get('/', getOjtHours);       // GET /api/ojt-hours
router.put('/', updateOjtHours);    // PUT /api/ojt-hours

module.exports = router;