const multer = require("multer");
const path = require("path");
const bucket = require("../firebase"); // Import the bucket from firebase.js

// Initialize upload middleware to handle multiple files in memory
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB per image
  storage: multer.memoryStorage(), // Store files in memory
});

// Function to upload a file to Firebase Storage
const uploadToFirebase = (file) => {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}${path.extname(file.originalname)}`;
    const storageFile = bucket.file(fileName);

    const stream = storageFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", (error) => reject(error.message));

    stream.on("finish", async () => {
      try {
        await storageFile.makePublic();
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve(fileUrl);
      } catch (error) {
        reject(error);
      }
    });

    stream.end(file.buffer);
  });
};

// Middleware to handle image uploads for hero data
const handleHeroImageUpload = async (req, res, next) => {
  try {
    await upload.array("projectsHeroImages", 10)(req, res, async (err) => {
      if (err) {
        console.error("hero Multer error:", err);
        return res.status(400).json({
          error: "Error in hero image upload middleware",
          message: err.message,
        });
      }

      // If files are uploaded, process each for heroData
      if (req.files) {
        // Array to store URLs for each hero image
        const heroImageUrls = [];
        for (const file of req.files) {
          const fileUrl = await uploadToFirebase(file);
          heroImageUrls.push(fileUrl);
        }

        // Assign image URLs to req.fileUrls for createProject to process
        req.fileUrls = heroImageUrls;
      }
      
      next();
    });
  } catch (error) {
    console.error("Error in handleHeroImageUpload:", error);
    res.status(500).json({ message: "Error handling hero image upload", error });
  }
};

// Middleware to handle image update (handles replacing images)
const handleImageUpdate = async (req, res, next) => {
  try {
    // Ensure that images are being uploaded
    if (!req.files || req.files.length === 0) {
      return next(); // No files to update, skip to next middleware
    }

    // Upload new images to Firebase
    const updatedImageUrls = [];
    for (const file of req.files) {
      const fileUrl = await uploadToFirebase(file);
      updatedImageUrls.push(fileUrl);
    }

    // If there were any old images that need to be deleted
    if (req.body.oldImages && Array.isArray(req.body.oldImages)) {
      for (const oldImageUrl of req.body.oldImages) {
        await deleteFromFirebase(oldImageUrl); // Delete old images from Firebase
      }
    }

    // Attach new image URLs to the request for further processing
    req.updatedImageUrls = updatedImageUrls;

    next();
  } catch (error) {
    console.error("Error in handleImageUpdate:", error);
    res.status(500).json({ message: "Error handling image update", error });
  }
};

// Function to delete a file from Firebase Storage
const deleteFromFirebase = async (imageUrl) => {
  if (!imageUrl) return;

  // Extract the filename from the URL
  const fileName = imageUrl.split("/").pop();
  const file = bucket.file(fileName);

  try {
    await file.delete();
    console.log("Image deleted successfully from Firebase:", fileName);
  } catch (error) {
    console.error("Error deleting image from Firebase:", error);
  }
};

module.exports = {
  handleHeroImageUpload,
  handleImageUpdate,
  deleteFromFirebase,
};
