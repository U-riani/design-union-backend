const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String },
  visitDate: { type: Date, required: true, unique: true }, // Ensure the visitDate is unique
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
