const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'worker'], default: 'worker' },
  contract: { type: String, enum: ['full-time', 'part-time'], default: 'full-time' }
});

module.exports = mongoose.model('User', userSchema);