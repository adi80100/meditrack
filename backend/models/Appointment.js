const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  notes: { type: String },
  googleEventId: { type: String },
  meetLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema); 