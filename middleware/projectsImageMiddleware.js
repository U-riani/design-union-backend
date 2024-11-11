const multer = require("multer");
const path = require("path");
const bucket = require("../firebase"); // Import the bucket from firebase.js

// Initialize multer to handle file uploads (in-memory storage)
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
        resolve({ fileUrl, fileName });
      } catch (error) {
        reject(error);
      }
    });

    stream.end(file.buffer);
  });
};

// Middleware to handle image uploads for hero data
const handleProjectsHeroImagesUpload = async (req, res, next) => {
  try {
    // Upload each image sent in the form data
    await upload.array("heroData[0][imageFile]", 10)(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({
          error: "Error in projectsHeroimage upload middleware",
          message: err.message,
        });
      }

      // If files are uploaded, process each file for Firebase upload
      if (req.files) {
        const uploadedImageDetails = [];
        for (const file of req.files) {
          const { fileUrl, fileName } = await uploadToFirebase(file);
          uploadedImageDetails.push({ fileUrl, fileName });
        }

        // Assign image URLs and filenames to the request for further processing
        req.uploadedImageDetails = uploadedImageDetails;
      }
      
      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    console.error("Error in handleProjectsHeroImagesUpload:", error);
    res.status(500).json({ message: "Error handling image upload", error });
  }
};

module.exports = {
  handleProjectsHeroImagesUpload,
};
