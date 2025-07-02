const Designers = require("../models/Designers");
const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function
const { sendMail } = require("./mailController");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Get all Designers
const getAllDesigners = async (req, res) => {
  try {
    const designers = await Designers.find().sort({ createdAt: -1 });
    return res.status(200).json(designers);
  } catch (error) {
    console.error("Error in getAllDesigners:", error);
    return res
      .status(500)
      .json({ error, customError: "Error in getAll Designers" });
  }
};

// // Get all Designers info for backup
// const getAllDesignersFile = async (req, res) => {
//   try {
//     const designers = await Designers.find().sort({ createdAt: -1 });

//     // Prepare text content
//     const lines = designers.map((designer) => {
//       const name = designer.name?.ge || "Unnamed";
//       const phone = designer.phone || "No phone";
//       return `${name}, ${phone}`;
//     });

//     const content = lines.join(os.EOL);

//     // Absolute path to root folder
//     const fileDir = path.join(__dirname, "..", "allDesignersData");
//     const filePath = path.join(fileDir, "designers.txt");

//     // Make sure the directory exists
//     if (!fs.existsSync(fileDir)) {
//       fs.mkdirSync(fileDir, { recursive: true });
//     }

//     // Write file to that folder
//     fs.writeFileSync(filePath, content, "utf-8");

//     return res.status(200).json({ message: "File saved successfully." });
//   } catch (error) {
//     console.error("Error in getAllDesigners:", error);
//     return res
//       .status(500)
//       .json({ error, customError: "Error in getAll Designers" });
//   }
// };

// Get all Designers
const getAllDesignersJsonFile = async (req, res) => {
  try {
    const designers = await Designers.find().sort({ createdAt: -1 });

    // Prepare text content
    const lines = designers.map((designer) => {
      const name = designer.name?.ge || "Unnamed";
      const phone = designer.phone || "No phone";
      return `${name}, ${phone}`;
    });

    const content = lines.join(os.EOL);

    // Absolute path to root folder
    const fileDir = path.join(__dirname, "..", "allDesignersData");
    const filePath = path.join(fileDir, "designers-backup.json");

    // Make sure the directory exists
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    const jsonContent = JSON.stringify(designers, null, 2);

    // Write file
    fs.writeFileSync(filePath, jsonContent, "utf-8");

    return res.status(200).json({
      message: "Designer data saved successfully.",
      file: filePath,
      count: designers.length,
    });
  } catch (error) {
    console.error("Error in getAllDesigners backup:", error);
    return res
      .status(500)
      .json({
        error,
        customError: "Error saving all designer data for backup",
      });
  }
};

const migrateDesignerImages = async () => {
  try {
    const designers = await Designers.find({
      images: { $exists: true, $ne: [] },
    });

    console.log(`Found ${designers.length} designers to migrate.`);

    for (const designer of designers) {
      const [profile, project] = designer.images;

      // Only update if new fields are missing
      const needsUpdate =
        !designer.profilePhoto ||
        designer.profilePhoto.length === 0 ||
        !designer.projectPhoto ||
        designer.projectPhoto.length === 0;

      if (needsUpdate) {
        designer.profilePhoto = profile ? [profile] : [];
        designer.projectPhoto = project ? [project] : [];
        designer.images = undefined; // remove old field
        await designer.save();
        console.log(`✔ Updated ${designer.name?.ge || designer._id}`);
      } else {
        console.log(
          `⚠ Skipped (already updated): ${designer.name?.ge || designer._id}`
        );
      }
    }

    console.log("✅ Migration complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

// Get some Designers
const getSomeDesigners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 12; // default to 10 items per page
    const skip = (page - 1) * limit;

    // Get paginated data
    const designers = await Designers.find({ activeStatus: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count of designers
    const totalCount = await Designers.countDocuments({ activeStatus: true }); // ✅

    return res.status(200).json({
      data: designers,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error in getSomeDesigners:", error);
    return res
      .status(500)
      .json({ error, customError: "Error in getSome Designers" });
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
    const isSplitUpload =
      req.fileUrls &&
      typeof req.fileUrls === "object" &&
      !Array.isArray(req.fileUrls);

    const designerData = {
      name: {
        ge: req.body.name.ge,
        en: req.body.name.en || "",
      },
      activeStatus: req.body.activeStatus,
      companyPerson: req.body.companyPerson,
      phone: req.body.phone,
      email: req.body.email,
      text: {
        ge: req.body.text?.ge || "",
        en: req.body.text?.en || "",
      },
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      behance: req.body.behance,
    };

    if (isSplitUpload) {
      // Save profile and project images separately
      designerData.profilePhoto = req.fileUrls.profileImage
        ? [req.fileUrls.profileImage]
        : [];
      designerData.projectPhoto = req.fileUrls.projectImage
        ? [req.fileUrls.projectImage]
        : [];

      // Optional: Also populate legacy "images" field
      designerData.images = [
        ...(req.fileUrls.profileImage ? [req.fileUrls.profileImage] : []),
        ...(req.fileUrls.projectImage ? [req.fileUrls.projectImage] : []),
      ];
    } else {
      // Fallback for old-style bulk uploads
      designerData.images = req.fileUrls || [];
    }

    const newDesigner = new Designers(designerData);
    await newDesigner.save();

    // Send notification emails
    const message = `${designerData.name.ge} wants to register`;
    await Promise.all([
      sendMail("designersunion.geo@gmail.com", "designersunion designer registration", message),
      sendMail("maisuradzemariami09.07@gmail.com", "designersunion designer registration", message),
      sendMail("q.urotadze@yahoo.com", "designersunion designer registration", message),
    ]);

    return res.status(200).json(newDesigner);
  } catch (error) {
    console.error("Error in create Designer:", error);
    return res
      .status(500)
      .json({ error, customError: "Error in create Designer" });
  }
};

// const createDesigner = async (req, res) => {
//   try {
//     const designerData = {
//       name: {
//         ge: req.body.name.ge,
//         en: req.body.name.en || "",
//       },
//       activeStatus: req.body.activeStatus,
//       companyPerson: req.body.companyPerson,
//       phone: req.body.phone,
//       email: req.body.email,
//       text: {
//         ge: req.body.text ? req.body.text.ge : "",
//         en: req.body.text ? req.body.text.en : "",
//       },
//       facebook: req.body.facebook,
//       instagram: req.body.instagram,
//       behance: req.body.behance,
//       // profilePhoto: req.fileUrls[0] ? [req.fileUrls[0]] : [],  // Ensure array format
//       // projectPhoto: req.fileUrls[1] ? [req.fileUrls[1]] : [],
//       images: req.fileUrls || [], // Use `fileUrls` from middleware
//     };

//     const newDesigners = new Designers(designerData);
//     await newDesigners.save();
//     await sendMail(
//       "designersunion.geo@gmail.com",
//       "designersunion designer registration",
//       `${designerData.name.ge} wants to register`
//     );
//     await sendMail(
//       "maisuradzemariami09.07@gmail.com",
//       "designersunion designer registration",
//       `${designerData.name.ge} wants to register`
//     );
//     await sendMail(
//       "q.urotadze@yahoo.com",
//       "designersunion designer registration",
//       `${designerData.name.ge} wants to register`
//     );
//     return res.status(200).json(newDesigners);
//   } catch (error) {
//     console.error("Error in create Designer:", error);
//     res.status(500).json({ error, customError: "Error in create Designer" });
//   }
// };

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
// const updateDesigner = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = {
//       name: {
//         en: req.body.name.en,
//         ge: req.body.name.ge,
//       },
//       companyPerson: req.body.companyPerson,
//       phone: req.body.phone,
//       email: req.body.email,
//       text: {
//         en: req.body.text.en,
//         ge: req.body.text.ge,
//       },
//       activeStatus: req.body.activeStatus,
//       facebook: req.body.facebook,
//       instagram: req.body.instagram,
//       behance: req.body.behance,
//     };

//     // Find existing designer document
//     const singleDesignerInfo = await Designers.findById(id);
//     if (!singleDesignerInfo) {
//       return res.status(404).json({ message: "Designer not found to update" });
//     }

//     // Handle new profileImage
//     if (req.fileUrls?.profileImage) {
//       // Delete old profile image
//       const oldProfile = singleDesignerInfo.images?.[0];
//       if (oldProfile) await deleteFromFirebase(oldProfile);
//       updatedData.images = updatedData.images || [];
//       updatedData.images[0] = req.fileUrls.profileImage;
//     }

//     // Handle new projectImage
//     if (req.fileUrls?.projectImage) {
//       const oldProject = singleDesignerInfo.images?.[1];
//       if (oldProject) await deleteFromFirebase(oldProject);
//       updatedData.images = updatedData.images || [];
//       updatedData.images[1] = req.fileUrls.projectImage;
//     }

//     const updatedDesigner = await Designers.findByIdAndUpdate(id, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json(updatedDesigner);
//   } catch (error) {
//     console.error("Failed to update Designer:", error);
//     res.status(500).json({ message: "Failed to update Designer", error });
//   }
// };
const updateDesigner = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      name: {
        en: req.body.name.en,
        ge: req.body.name.ge,
      },
      companyPerson: req.body.companyPerson,
      phone: req.body.phone,
      email: req.body.email,
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

    if (req.fileUrls?.profileImage) {
      const oldProfile = singleDesignerInfo.profilePhoto?.[0];
      if (oldProfile) await deleteFromFirebase(oldProfile);
      updatedData.profilePhoto = [req.fileUrls.profileImage];
    }

    if (req.fileUrls?.projectImage) {
      const oldProject = singleDesignerInfo.projectPhoto?.[0];
      if (oldProject) await deleteFromFirebase(oldProject);
      updatedData.projectPhoto = [req.fileUrls.projectImage];
    }

    console.log("------ Received files URLs:", req.fileUrls);

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
  getSomeDesigners,
  createDesigner,
  deleteDesigner,
  updateDesigner,
  getAllDesignersJsonFile,
  migrateDesignerImages,
};
