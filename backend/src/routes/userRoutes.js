const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', protect, userController.getProfile);

// Admin routes
router.get('/admin/interns', protect, adminOnly, userController.getAllInterns);
router.get('/admin/interns/:id/attendance', protect, adminOnly, userController.getInternAttendance);
router.get('/admin/interns/:id/logs', protect, adminOnly, userController.getInternLogs);
router.delete('/admin/interns/:id', protect, adminOnly, userController.deleteUser);
router.put('/admin/interns/:id/ojt-hours', protect, adminOnly, userController.updateInternOjtHours); // ← new

module.exports = router;