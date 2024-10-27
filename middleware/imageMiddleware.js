const News = require("../models/News"); // Import News model
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
    console.log("Request File (imageMiddleware):", req.file);
    if (!req.file) {
      return reject(`No file provided(imageMiddleware): ${JSON.stringify(req.file)}`);
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
      file.makePublic()
        .then(() => {
          const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          resolve(fileUrl);
        })
        .catch(reject);
    });

    stream.end(req.file.buffer);
  });
};

// Delete an image from Firebase
const deleteFromFirebase = async (imageUrl) => {
  if (!imageUrl) return;

  const fileName = imageUrl.split("/").pop();
  const file = bucket.file(fileName);

  try {
    await file.delete();
    console.log("Image deleted successfully from Firebase:", fileName);
  } catch (error) {
    console.error("Error deleting image from Firebase:", error);
  }
};

// Middleware for handling image upload and replacement
const handleImageUpload = async (req, res, next) => {
  try {
    await upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ myerr: 'error in imageMiddleware in handleImageUpload', message: err.message });

      // Check if a new image is uploaded, then delete the old image if present
      if (req.file) {
        const newsItem = await News.findById(req.params.id);
        if (newsItem && newsItem.image) {
          await deleteFromFirebase(newsItem.image); // Delete existing image
        }

        // Upload new image and set the file URL in the request object
        req.fileUrl = await uploadToFirebase(req);
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Error handling image upload", error });
  }
};

module.exports = {
  handleImageUpload
};
