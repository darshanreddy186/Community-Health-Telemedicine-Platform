const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  specialization: { type: String },
  availability: { type: String },
  experience: { type: Number, default: 0 },
  availableSlots: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true },   // doctor availability toggle
  rating: { type: Number, default: 0, min: 0, max: 5 }, // for top doctors sort
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
