const News = require("../models/News"); // Import News model

// Save news
const saveNews = async (req, res) => {
  try {
    const newsData = {
      title: {
        en: req.body.title.en,
        ge: req.body.title.ge,
      },
      text: {
        en: req.body.text.en,
        ge: req.body.text.ge,
      },
      image: req.fileUrl, // The URL from Firebase
    };

    const newNews = new News(newsData);
    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: "Error saving news", error });
  }
};

// Get all news
const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news", error });
  }
};

// Get a single news article by ID
const getSingleNews = async (req, res) => {
  try {
    const singleNews = await News.findById(req.params.id);
    if (!singleNews) return res.status(404).json({ message: "News not found" });
    res.status(200).json(singleNews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news", error });
  }
};

// Update a single news article by ID
const updateSingleNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      title: {
        en: req.body.title.en,
        ge: req.body.title.ge,
      },
      text: {
        en: req.body.text.en,
        ge: req.body.text.ge,
      },
    };

    // Update image if a new one is uploaded
    if (req.fileUrl) {
      updatedData.image = req.fileUrl;
    }

    const singleNews = await News.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!singleNews) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json(singleNews);
  } catch (error) {
    res.status(500).json({ message: "Failed to update news", error });
  }
};

// Delete a news article by ID
const deleteNews = async (req, res) => {
  try {
    const singleNews = await News.findByIdAndDelete(req.params.id);
    if (!singleNews) return res.status(404).json({ message: "News not found" });
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete news", error });
  }
};

// Get the last 5 news articles
const getLast5News = async (req, res) => {
  try {
    const last5News = await News.find().sort({ date: -1 }).limit(5).select("title image");
    res.status(200).json(last5News);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch the latest 5 news", error });
  }
};

module.exports = {
  saveNews,
  getAllNews,
  getSingleNews,
  getLast5News,
  updateSingleNews,
  deleteNews,
};
