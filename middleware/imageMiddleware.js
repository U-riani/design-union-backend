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
      if (err) return res.status(400).json({ message: err.message });

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

// Update a single news article with image replacement
const updateSingleNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      title: req.body.title,
      text: req.body.text,
    };

    // Update image if a new one is uploaded
    if (req.fileUrl) {
      updatedData.image = req.fileUrl;
    }

    const singleNews = await News.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!singleNews) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json(singleNews);
  } catch (error) {
    res.status(500).json({ message: "Failed to update news", error });
  }
};


// // Middleware to handle file upload
// const handleImageUpload = async (req, res, next) => {
//   try {
//     await upload.single("image")(req, res, async (err) => {
//       if (err) return res.status(400).send(err.message);
//       req.fileUrl = await uploadToFirebase(req);
//       next();
//     });
//   } catch (error) {
//     return res.status(500).send({error: 'erroria errori'});
//   }
// };

module.exports = {
  handleImageUpload,
  updateSingleNews
};
