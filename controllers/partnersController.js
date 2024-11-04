const Partners = require("../models/Partners");
const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

// Get all Partners
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partners.find();
    return res.status(200).json(partners);
  } catch (error) {
    console.error("Error in getAllPartners:", error);
    return res.status(500).json({ error, customError: "Error in getAll Partners" });
  }
};

// Get a single partner
const getSinglePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const singlePartner = await Partners.findById(id);
    if (!singlePartner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    return res.status(200).json(singlePartner);
  } catch (error) {
    console.error("Error in getSinglePartner:", error);
    return res.status(500).json({ error, customError: "Error in get single partner" });
  }
};

// Create a new partner
const createPartner = async (req, res) => {
  try {
    const partnerData = {
      title: {
        ge: req.body.title.ge,
        en: req.body.title.en,
      },
      text: {
        ge: req.body.text.ge,
        en: req.body.text.en,
      },
      image: req.fileUrls || [], // Use `fileUrls` from middleware
    };

    const newPartners = new Partners(partnerData);
    await newPartners.save();
    return res.status(200).json(newPartners);
  } catch (error) {
    console.error("Error in create Partner:", error);
    res.status(500).json({ error, customError: "Error in create Partner" });
  }
};

// Delete a partner
const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
  
    const singlePartner = await Partners.findById(id);
    if (!singlePartner) {
      return res.status(404).json({ message: "No such partner to delete" });
    }

    // Delete associated image(s) from Firebase
    if (singlePartner.image  && singlePartner.image.length > 0) {
      await deleteFromFirebase(singlePartner.image[0]);
    }

    await Partners.findByIdAndDelete(id);
    res.status(200).json({ message: "Partner deleted successfully" });
  } catch (error) {
    console.error("Error in deletePartner:", error);
    return res.status(500).json(error);
  }
};

// Update a partner
const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      title: {
        en: req.body.title.en,
        ge: req.body.title.ge,
      },
      text: {
        en: req.body.text.en,
        ge: req.body.text.ge,
      },
    };

    // Find existing partner document
    const singlePartnerInfo = await Partners.findById(id);
    if (!singlePartnerInfo) {
      return res.status(404).json({ message: "Partner not found to update" });
    }

    // Handle image updates if new images are uploaded
    if (req.fileUrls && req.fileUrls.length > 0) {
      // Delete old image(s)
      if (singlePartnerInfo.image && singlePartnerInfo.image.length > 0) {
        await deleteFromFirebase(singlePartnerInfo.image[0]);
      }

      // Set new images
      updatedData.image = req.fileUrls;
    }

    const updatedPartner = await Partners.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedPartner);
  } catch (error) {
    console.error("Failed to update Partner:", error);
    res.status(500).json({ message: "Failed to update Partner", error });
  }
};

module.exports = {
  getSinglePartner,
  getAllPartners,
  createPartner,
  deletePartner,
  updatePartner,
};
