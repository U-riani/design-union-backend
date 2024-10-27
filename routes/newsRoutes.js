// const express = require('express');
// const News = require('../models/News');
// const router = express.Router();
// const {saveNews} = require('../controllers/newsControllers') 

// // Create a news entry
// router.post('/news', saveNews);

// // Get all news
// router.get('/news', async (req, res) => {
//   try {
//     const newsList = await News.find();
//     res.status(200).json(newsList);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching news', error });
//   }
// });

// // Get single news by ID
// router.get('/news/:id', async (req, res) => {
//   try {
//     const news = await News.findById(req.params.id);
//     if (!news) return res.status(404).json({ message: 'News not found' });
//     res.status(200).json(news);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching news', error });
//   }
// });

// module.exports = router;

// newsRoutes.js

// const express = require('express');
// const multer = require('multer');
// const { saveNews, getAllNews, getSingleNews } = require('../controllers/newsControllers');
// const { validateNewsData } = require('../middleware/newsMiddleware');

// const router = express.Router(); 
// const upload = multer({ dest: 'uploads/' }); // Configure multer

// // Route to save news
// router.post('/news', upload.single('image'), validateNewsData, saveNews);

// // Route to get all news
// router.get('/news', getAllNews);

// // Route to get a single news article by ID
// router.get('/news/:id', getSingleNews);

// module.exports = router;
const express = require('express');
const { 
  saveNews, 
  getAllNews, 
  getSingleNews, 
  getLast5News, 
  updateSingleNews, 
  deleteNews 
} = require('../controllers/newsControllers');
const { validateNewsData } = require('../middleware/newsMiddleware');
const upload = require('../middleware/imageMiddleware'); // Ensure this is imported
const uploadToFirebase = require('../middleware/imageMiddleware')

const router = express.Router();

// Route to save news
router.post('/news', uploadToFirebase, validateNewsData, saveNews);

// Route to get all news
router.get('/news', getAllNews);

// Route to get a single news article by ID
router.get('/news/:id', getSingleNews);

// Route to update a single news article by ID
router.patch('/news/:id', upload, updateSingleNews); // Ensure upload middleware is used

// Route to delete a single news article by ID
router.delete('/news/:id', deleteNews);

// Get last 5 news for cardsSlider
router.get('/last5News', getLast5News);

module.exports = router;
