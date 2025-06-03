const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema(
  {
    title: {
      en: String,
      ge: String,
    },
    // text: { type: String, required: true },
    text: {
      en: String,
      ge: String,
    },
    images: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }  
);

module.exports = mongoose.model("Blogs", blogsSchema);
