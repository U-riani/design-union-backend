const mongoose = require("mongoose");

const heroDataSchema = new mongoose.Schema(
  {
    heroText: {
      en: { type: String,  },
      ge: { type: String,  },
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
