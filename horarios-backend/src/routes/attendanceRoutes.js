// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware } = require('../middleware/auth');

router.post('/clock-in', authMiddleware, attendanceController.clockIn);
router.post('/clock-out', authMiddleware, attendanceController.clockOut);
router.get('/records', authMiddleware, attendanceController.getAttendanceRecords);

module.exports = router;