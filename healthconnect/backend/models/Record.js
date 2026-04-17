const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  url: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
