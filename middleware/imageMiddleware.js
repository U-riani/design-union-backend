const multer = require("multer");
const path = require("path");
const bucket = require("../firebase"); // Import the bucket from your firebase.js

// Init upload middleware
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  storage: multer.memoryStorage(), // Store file in memory
});

// Upload to Firebase Storage
const uploadToFirebase = (req) => {
  return new Promise((resolve, reject) => {
    console.log(req.file) 
    if (!req.file) {
      return reject(`modif: ${req} - ${req.file}`)
    }

    const fileName = `${Date.now()}${path.extname(req.file.originalname)}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (error) => {
      return reject(error.message);
    });

    stream.on("finish", () => {
      file.makePublic().then(() => {
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve(fileUrl);
      }).catch(reject);
    });

    stream.end(req.file.buffer);
  });
};

// Middleware to handle file upload
const handleImageUpload = async (req, res, next) => {
  try {
    await upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).send(err.message);
      req.fileUrl = await uploadToFirebase(req);
      next();
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  handleImageUpload,
};
