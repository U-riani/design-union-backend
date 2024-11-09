const mongoose = require("mongoose");

const projectsSchema = new mongoose.Schema(
  {
    name: {
      en: String,
      ge: String,
    },
    description: {
      en: String,
      ge: String,
    },
    heroText: {
      en: String,
      ge: String, 
    },
    
    mainProject: {type: Boolean, default: false},
    image: [{ type: String }],
    // media: [
    //   {
    //     title: {
    //       en: String,
    //       ge: String,
    //     },
    //     images: [{ type: String }],
    //     url: [{ type: String }],
    //   },
    // ],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Projects", projectsSchema);
