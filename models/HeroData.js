const mongoose = require("mongoose");

const heroDataSchema = new mongoose.Schema(
  {
    heroText: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HeroImage", // Reference to Image model
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroData", heroDataSchema);
