const Designers = require("../models/Designers");
const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

// Get all Designers
const getAllDesigners = async (req, res) => {
  try {
    const designers = await Designers.find();
    return res.status(200).json(designers);
  } catch (error) {
    console.error("Error in getAllDesigners:", error);
    return res
      .status(500)
      .json({ error, customError: "Error in getAll Designers" });
  }
};

// Get a single designer
const getSingleDesigner = async (req, res) => {
  try {
    const { id } = req.params;
    const singleDesigner = await Designers.findById(id);
    if (!singleDesigner) {
      return res.status(404).json({ message: "Designer not found" });
    }
    return res.status(200).json(singleDesigner);
  } catch (error) {
    console.error("Error in getSingleDesigner:", error);
    return res
      .status(500)
      .json({ error, customError: "Error in get single designer" });
  }
};

// Create a new designer
const createDesigner = async (req, res) => {
  try {
    const designerData = {
      name: {
        ge: req.body.name.ge,
        en: req.body.name.en || "",
      },
      companyPerson: req.body.companyPerson,
      text: {
        ge: req.body.text ? req.body.text.ge : "",
        en: req.body.text ? req.body.text.en : "",
      },
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      behance: req.body.behance,
      // profilePhoto: req.fileUrls[0] ? [req.fileUrls[0]] : [],  // Ensure array format
      // projectPhoto: req.fileUrls[1] ? [req.fileUrls[1]] : [],
      images: req.fileUrls || [], // Use `fileUrls` from middleware
    };

    const newDesigners = new Designers(designerData);
    await newDesigners.save();
    return res.status(200).json(newDesigners);
  } catch (error) {
    console.error("Error in create Designer:", error);
    res.status(500).json({ error, customError: "Error in create Designer" });
  }
};

// Delete a designer
const deleteDesigner = async (req, res) => {
  try {
    const { id } = req.params;

    const singleDesigner = await Designers.findById(id);
    if (!singleDesigner) {
      return res.status(404).json({ message: "No such designer to delete" });
    }

    // Delete associated image(s) from Firebase
    if (singleDesigner.images && singleDesigner.images.length > 0) {
      singleDesigner.images.forEach(async (item, i) => {
        await deleteFromFirebase(item);
      });
    }

    await Designers.findByIdAndDelete(id);
    res.status(200).json({ message: "Designer deleted successfully" });
  } catch (error) {
    console.error("Error in delete Designer:", error);
    return res.status(500).json(error);
  }
};

// Update a designer
const updateDesigner = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      name: {
        en: req.body.name.en,
        ge: req.body.name.ge,
      },
      companyPerson: req.body.companyPerson,
      text: {
        en: req.body.text.en,
        ge: req.body.text.ge,
      },
      activeStatus: req.body.activeStatus,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      behance: req.body.behance,
    };

    // Find existing designer document
    const singleDesignerInfo = await Designers.findById(id);
    if (!singleDesignerInfo) {
      return res.status(404).json({ message: "Designer not found to update" });
    }

    // Handle image updates if new images are uploaded
    if (req.fileUrls && req.fileUrls.length > 0) {
      // Delete old image(s)
      if (singleDesignerInfo.images && singleDesignerInfo.images.length > 0) {
        singleDesignerInfo.images.forEach(async () => {
          await deleteFromFirebase(item);
        });
      }
      // Set new images
      req.fileUrls.map((item, i) => {
        updatedData.image = req.fileUrls[i];
      });

    }

    const updatedDesigner = await Designers.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedDesigner);
  } catch (error) {
    console.error("Failed to update Designer:", error);
    res.status(500).json({ message: "Failed to update Designer", error });
  }
};

module.exports = {
  getSingleDesigner,
  getAllDesigners,
  createDesigner,
  deleteDesigner,
  updateDesigner,
};
