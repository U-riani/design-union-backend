const AboutUs = require("../models/AboutUs");
const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

// Get  AboutUs
const getAboutUs = async (req, res) => {
  try {
    const data = await AboutUs.find();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getAboutUs:", error);
    return res
      .status(500)
      .json({ error, customError: "Error in get about us" });
  }
};

// Create a new aboutUs
const createAboutUs = async (req, res) => {
  try {
    const data = {
      text: {
        ge: req.body.text.ge,
        en: req.body.text.en,
      },
      image: req.fileUrls || [], // Use `fileUrls` from middleware
    };

    const newAboutUs = new AboutUs(data);
    await newAboutUs.save();
    return res.status(200).json(newAboutUs);
  } catch (error) {
    console.error("Error in createAboutUs:", error);
    res.status(500).json({ error, customError: "Error in create about Us" });
  }
};

// Update a AboutUs
const updateAboutUs = async (req, res) => {
  try {
    const  id = req.body.id;
    const updatedData = {
      text: {
        ge: req.body.text.ge,
        en: req.body.text.en,
      },
    };
    console.log('---')

    // Find existing AboutUs document
    const aboutUsData = await AboutUs.findById(id);
    if (!aboutUsData) {
      return res.status(404).json({ message: "aboutUs not found to update" });
    }

    // Handle image updates if new images are uploaded
    if (req.fileUrls && req.fileUrls.length > 0) {
      console.log('--++++--')
      // Delete old image(s)
      if (aboutUsData.image && aboutUsData.image.length > 0) {
        await deleteFromFirebase(aboutUsData.image[0]);
      }

      // Set new images
      updatedData.image = req.fileUrls;
    }

    const updatedAboutUs = await AboutUs.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedAboutUs);
  } catch (error) {
    console.error("Failed to update aboutUs:", error);
    res.status(500).json({ message: "Failed to update about us", error });
  }
};

module.exports = {
  getAboutUs,
  createAboutUs,
  updateAboutUs,
};
