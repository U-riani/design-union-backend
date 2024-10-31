const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String },
    visitDate: { type: Date, required: true }, // renamed to visitDate
    createdAt: { type: Date, default: Date.now } // date the visit was booked
});

module.exports = mongoose.model("Visit", visitSchema);
