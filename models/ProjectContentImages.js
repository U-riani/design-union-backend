const mongoose = require("mongoose");

const projectContentImageSchema = new mongoose.Schema(
  {
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ProjectContentImage",
  projectContentImageSchema
);
