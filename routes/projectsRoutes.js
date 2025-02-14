const express = require("express");
const {
  getSingleProject,
  getAllProjects,
  getLastThreeProjects,
  createProject,
  deleteProject,
  updateProject,
  getAllprojectsImageTitleText
} = require("../controllers/projectsController");
// const { handleProjectsHeroImagesUpload } = require("../middleware/projectsImageMiddleware");
const { handleImageUpload } = require('../middleware/imageMiddleware');
// const {
//   handleHeroImageUpload,
//   handleImageUpdate,
//   deleteFromFirebase,
// } = require("../middleware/projectsImageMiddleware");

const router = express.Router();

router.get("/", getAllProjects);

router.get("/lastThreeProjects", getLastThreeProjects);

router.get("/projectsImageTitleText", getAllprojectsImageTitleText);

router.get("/:id", getSingleProject);

router.post("/", handleImageUpload, createProject);

router.delete("/:id", deleteProject);

// router.patch("/:id", handleImageUpload, updateProject);

module.exports = router;
