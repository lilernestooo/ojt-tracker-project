// src/routes/logsRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getLogs,
  createLog,
  updateLog,
  deleteLog,
} = require('../controllers/logsController');

// All routes are protected
router.use(protect);

router.get('/', getLogs);
router.post('/', createLog);
router.put('/:id', updateLog);
router.delete('/:id', deleteLog);

module.exports = router;