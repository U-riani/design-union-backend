const mongoose = require("mongoose");

const designersSchema = new mongoose.Schema(
  {
    name: {
      en: String,
      ge: String, 
    },
    companyPerson: {type: String},
    text: {
      en: String,
      ge: String, 
    },
    phone: {type: String, default: ''},
    facebook: {type: String},
    instagram: {type: String},
    behance: {type: String},
    images: [{ type: String }],
    // profilePhoto: [{ type: String }],
    // projectPhoto: [{ type: String }],
    activeStatus: {type: Boolean, default: false},
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Designers", designersSchema);
