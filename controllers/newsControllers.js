const News = require("../models/News");

// Save news
const saveNews = async (req, res) => {
  try {
    const newNews = new News({
      title: req.body.title,
      text: req.body.text,
      image: req.file ? req.file.path : null, // Get the image path from the uploaded file
    });
    
    console.log("Uploaded Image Path:", req.file ? req.file.path : "No image uploaded"); // Log the image path

    const savedNews = await newNews.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Failed to save news", error });
  }
};

// Get all news
const getAllNews = async (req, res) => {
  try {
    // const news = await News.find();
    res.status(200).json({news: 'fixed'});
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

// Delete a news by ID
const deleteNews = async (req, res) => {
  try {
    const singleNews = await News.findByIdAndDelete(req.params.id);
    if (!singleNews) return res.status(404).json({ message: "News not found" });
    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete news", error });
  }
};

// Update a single news article by ID
const updateSingleNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      title: req.body.title,
      text: req.body.text,
    };

    // Add image path if a new image is uploaded
    if (req.file) {
      updatedData.image = req.file.path;
    }

    // Find and update the news item
    const singleNews = await News.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true, // Ensure validation is applied
    });

    if (!singleNews) {
      return res.status(404).json({ message: "News not found" });
    }

    console.log("Updated news:", singleNews); // Debug: log updated news
    res.status(200).json(singleNews);
  } catch (error) {
    console.error("Update failed:", error); // Debug: log error if any
    res.status(500).json({ message: "Failed to update news", error });
  }
};

// Get the last 5 news articles
const getLast5News = async (req, res) => {
  try {
    const last5News = await News.find().sort({ date: -1 }).limit(5);
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
  deleteNews
};
