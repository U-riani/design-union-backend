const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    text: {
      en: String,
      ge: String, 
    },
    image: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutUs", aboutUsSchema);
