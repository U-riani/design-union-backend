const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    companyPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profileImage: [{ type: String, required: true }],
    projectImage: [{ type: String, required: true }],
    facebook: { type: String, required: true },
    instagram: { type: String, required: true },
    behance: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
