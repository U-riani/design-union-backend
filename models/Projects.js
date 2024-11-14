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
    mainProject: { type: Boolean, default: false },
    projectContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectContent", // Reference to ProjectContent schema
      },
    ],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Projects", projectsSchema);
