const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    message: {type: String},
    date: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Visits", visitSchema)