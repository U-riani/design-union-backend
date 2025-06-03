
const express = require('express');
const { 
  saveBlog, 
  getAllBlogs, 
  getSingleBlogs, 
  getLast5Blogs, 
  updateSingleBlogs, 
  deleteBlogs 
} = require('../controllers/blogsController'); 
const { validateBlogsData } = require('../middleware/blogsMiddleware');
const { handleImageUpload } = require('../middleware/imageMiddleware');

const router = express.Router();

// Route to save blogs
router.post('/blogs', handleImageUpload, validateBlogsData, saveBlog);

// Route to get all blogs
router.get('/blogs', getAllBlogs);

// For Vercel testing
router.get('/test', async (req, res) => {
  try {
    res.json({ message: 'Blogs endpoint is working' });
  } catch (err) {
    res.json({ error: err.message, myError: 'my error' });
  }
});

// Route to get a single blogs article by ID
router.get('/blogs/:id', getSingleBlogs);

// Route to update a single blogs article by ID
router.patch('/blogs/:id', handleImageUpload, updateSingleBlogs);

// Route to delete a single blogs article by ID
router.delete('/blogs/:id', deleteBlogs);

// Get last 5 blogs for cardsSlider
router.get('/last5Blogs', getLast5Blogs);

module.exports = router;
