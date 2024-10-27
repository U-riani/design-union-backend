const express = require('express');
const router = express.Router();
const uploadImage = require('../controllers/imageController');
// const upload = require('../middleware/imageMiddleware');
const {handleImageUpload} = require('../middleware/imageMiddleware')

// Upload route
router.post('/upload', handleImageUpload);

module.exports = router;
