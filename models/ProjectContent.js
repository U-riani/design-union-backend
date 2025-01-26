const mongoose = require("mongoose");

const projectContentSchema = new mongoose.Schema(
  {
    title: {
      ge: { type: String, required: true },
      en: { type: String, required: true },
    },
    media: {
      youtube: {
        videoId: { type: String }, // This will store the YouTube video ID or URL
        thumbnail: {
          type: String, // This will store the YouTube thumbnail URL
          default: "https://img.youtube.com/vi/GZJO4YjuouA/maxresdefault.jpg",
        },
      },
      images: [
        {
          url: { type: String },
        },
      ],
      //   images: [
      //     {
      //       type: mongoose.Schema.Types.ObjectId,
      //       ref: "ProjectContentImage", // Reference to HeroData schema
      //     },
      //   ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectContent", projectContentSchema);
