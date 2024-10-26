const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../middleware/imageMiddleware');

// Upload route
router.post('/upload', upload, imageController.uploadImage);

module.exports = router;
