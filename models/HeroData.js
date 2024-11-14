const mongoose = require("mongoose");

const heroDataSchema = new mongoose.Schema(
  {
    heroText: {
      en: { type: String },
      ge: { type: String },
    },
    image: {
      url: { type: String, required: true },
      // fileName: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroData", heroDataSchema);
