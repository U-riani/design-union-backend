const mongoose = require("mongoose");

const designersSchema = new mongoose.Schema(
  {
    name: {
      en: String,
      ge: String, 
    },
    text: {
      en: String,
      ge: String, 
    },
    facebook: {type: String},
    instagram: {type: String},
    behance: {type: String},
    profilePhoto: { type: String },
    projectPhoto: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Designers", designersSchema);
