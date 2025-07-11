const multer = require("multer");
const path = require("path");
const bucket = require("../firebase"); // Import the bucket from firebase.js

// Init upload middleware to handle multiple files in memory
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 10MB per image
  storage: multer.memoryStorage(), // Store files in memory
});

// Upload to Firebase Storage - modified for multiple files
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

// Delete an image from Firebase by URL
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

// Middleware for handling multiple image uploads and replacement
const handleImageUpload = async (req, res, next) => {
  try {
    const isDesignerRoute = req.originalUrl.includes("/designers");

    const multerHandler = isDesignerRoute
      ? upload.fields([
          { name: "profileImage", maxCount: 1 },
          { name: "projectImage", maxCount: 1 },
        ])
      : upload.array("images", 20);

    await multerHandler(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({
          error: "Error in image upload middleware",
          message: err.message,
        });
      }

      // // If there are files uploaded, handle them
      // if (req.files) {
      //   // Upload each new image to Firebase
      //   const imageUrls = [];
      //   for (const file of req.files) {
      //     const fileUrl = await uploadToFirebase(file);
      //     imageUrls.push(fileUrl);
      //   }

      //   // Set the file URLs in the request object to pass to the controller
      //   req.fileUrls = imageUrls;
      // }
      // If there are uploaded files, process them
      if (req.files) {
        if (isDesignerRoute) {
          // Special handling for designers: separate profile and project image
          const uploadedUrls = {};

          if (req.files.profileImage && req.files.profileImage[0]) {
            uploadedUrls.profileImage = await uploadToFirebase(
              req.files.profileImage[0]
            );
          }

          if (req.files.projectImage && req.files.projectImage[0]) {
            uploadedUrls.projectImage = await uploadToFirebase(
              req.files.projectImage[0]
            );
          }

          req.fileUrls = uploadedUrls;
        } else {
          // Generic handling for others
          const uploadPromises = req.files.map(uploadToFirebase);
          const results = await Promise.allSettled(uploadPromises);

          req.fileUrls = results
            .filter((res) => res.status === "fulfilled")
            .map((res) => res.value);

          const failedUploads = results.filter(
            (res) => res.status === "rejected"
          );
          if (failedUploads.length > 0) {
            console.warn("Some images failed to upload:", failedUploads);
          }
        }
      }

      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Error handling image upload", error });
  }
};

module.exports = {
  handleImageUpload,
  deleteFromFirebase, // Export the delete function
};
