const Blogs = require("../models/Blogs"); // Import Blogs model
const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

// Save blogs with multiple images
const saveBlog = async (req, res) => {
  try {
    const blogData = {
      title: {
        en: req.body.title.en,
        ge: req.body.title.ge,
      },
      text: {
        en: req.body.text.en,
        ge: req.body.text.ge,
      },
      images: req.fileUrls || [], // Array of URLs from Firebase
    };

    const newBlog = new Blogs(blogData);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "Error saving blog", error });
  }
}; 

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blog = await Blogs.find();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog", error });
  }
};

// Get a single news article by ID
const getSingleBlogs = async (req, res) => {
  try {
    const singleBlogs = await Blogs.findById(req.params.id);
    if (!singleBlogs) return res.status(404).json({ message: "Blogs not found" });
    res.status(200).json(singleBlogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error });
  }
};

// Update a single news article by ID with new images if provided
const updateSingleBlogs = async (req, res) => {
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

    //find news
    const singleBlogsInfo = await Blogs.findById(req.params.id);
    if (!singleBlogsInfo)
      return res.status(404).json({ message: "Blogs not found" });



    // Update images if new ones are uploaded
    if (req.fileUrls && req.fileUrls.length > 0) {
      // delete all old images
      for (const imageUrl of singleBlogsInfo.images) {
        await deleteFromFirebase(imageUrl);
      }
      updatedData.images = req.fileUrls;
    }

    const singleBlogs = await Blogs.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!singleBlogs) {
      return res.status(404).json({ message: "Blogs not found" });
    }

    res.status(200).json(singleBlogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog", error });
  }
};

// Delete a news article by ID and associated images from Firebase
const deleteBlogs = async (req, res) => {
  try {
    const singleBlogs = await Blogs.findById(req.params.id);
    if (!singleBlogs) return res.status(404).json({ message: "Blogs not found" });

    // Delete images from Firebase
    for (const imageUrl of singleBlogs.images) {
      await deleteFromFirebase(imageUrl);
    }

    // Delete the news article
    await Blogs.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blogs deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog", error });
  }
};

// Get the last 5 news articles with title and images
const getLast5Blogs = async (req, res) => {
  try {
    const last5Blogs = await Blogs.find()
      .sort({ date: -1 })
      .limit(5)
      .select("title images text"); // Updated to retrieve the array of images
    res.status(200).json(last5Blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch the latest 5 blogs", error });
  }
};

module.exports = {
  saveBlog,
  getAllBlogs,
  getSingleBlogs,
  getLast5Blogs,
  updateSingleBlogs,
  deleteBlogs,
};
