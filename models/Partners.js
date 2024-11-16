const mongoose = require("mongoose");

const partnersSchema = new mongoose.Schema(
  {
    name: {
      en: String,
      ge: String,
    },
    text: {
      en: String,
      ge: String,
    },
    websiteUrl: {
      type: String,
    },
    image: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partners", partnersSchema);
