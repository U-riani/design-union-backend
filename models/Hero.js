const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    text: {
      en: String,
      ge: String, 
    },
    images: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);
