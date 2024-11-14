const mongoose = require("mongoose");

const projectContentSchema = new mongoose.Schema(
  {
    title: {
      ge: { type: String, required: true },
      en: { type: String, required: true },
    },
    media: {
      youtube: {
        type: String,
      },

      images: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProjectContentImage", // Reference to HeroData schema
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectContent", projectContentSchema);
