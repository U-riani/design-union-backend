const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ge: { type: String, required: true },
    },
    heroData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HeroData", // Reference to HeroData schema
      },
    ],
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HeroImage", // If images are stored separately in HeroImage collection
      },
    ], // Add an array of images, if needed
    mainProject: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Projects", projectsSchema);
