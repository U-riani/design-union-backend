const multer = require('multer');
const path = require('path');
const bucket = require('./firebase'); // Import the bucket from your firebase.js

// Init upload middleware
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  storage: multer.memoryStorage(), // Store file in memory
}).single('image'); // 'image' is the field name used to send the image

// Upload to Firebase Storage
const uploadToFirebase = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileName = `${Date.now()}${path.extname(req.file.originalname)}`;
  const file = bucket.file(fileName);
  
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on('error', (error) => {
    return res.status(500).send(error.message);
  });

  stream.on('finish', () => {
    // Make the file publicly accessible (optional)
    file.makePublic().then(() => {
      return res.status(200).send(`File uploaded successfully: ${fileName}`);
    });
  });

  stream.end(req.file.buffer);
};

module.exports = { upload, uploadToFirebase };
