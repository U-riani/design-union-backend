const News = require("../models/News"); // Import News model

// Save news with multiple images
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
      images: req.fileUrls, // Array of URLs from Firebase
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

// Update a single news article by ID with new images if provided
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

    // Update images if new ones are uploaded
    if (req.fileUrls && req.fileUrls.length > 0) {
      updatedData.images = req.fileUrls;
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

// Get the last 5 news articles with title and images
const getLast5News = async (req, res) => {
  try {
    const last5News = await News.find()
      .sort({ date: -1 })
      .limit(5)
      .select("title images"); // Updated to retrieve the array of images
    res.status(200).json(last5News);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the latest 5 news", error });
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
