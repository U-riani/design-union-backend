const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      en: String,
      ge: String,
    },
    // text: { type: String, required: true },
    text: {
      en: String,
      ge: String,
    },
    image: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
