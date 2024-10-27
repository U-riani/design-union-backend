const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
// const upload = require('../middleware/imageMiddleware');
const {handleImageUpload} = require('../middleware/imageMiddleware')

// Upload route
router.post('/upload', upload.single('image'), imageController.uploadImage);

module.exports = router;
