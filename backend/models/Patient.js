const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  contact: { type: String },
  address: { type: String },
  medicalHistory: [{ type: String }],
  vitals: {
    height: Number,
    weight: Number,
    bloodPressure: String,
    temperature: Number,
    pulse: Number
  },
  prescriptions: [{
    date: Date,
    medication: String,
    dosage: String,
    instructions: String
  }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  files: [{ filename: String, url: String, uploadedAt: Date }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema); 