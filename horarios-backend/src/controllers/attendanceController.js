// controllers/attendanceController.js
const Attendance = require('../models/Attendance');

const attendanceController = {
  clockIn: async (req, res) => {
    try {
      const attendance = await Attendance.create({
        worker: req.user.id,
        type: 'entrada',
        time: new Date().toLocaleTimeString()
      });
      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  clockOut: async (req, res) => {
    try {
      const attendance = await Attendance.create({
        worker: req.user.id,
        type: 'salida',
        time: new Date().toLocaleTimeString()
      });
      res.status(201).json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAttendanceRecords: async (req, res) => {
    try {
      const records = await Attendance.find()
        .populate('worker', 'name')
        .sort({ date: -1 });
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = attendanceController;