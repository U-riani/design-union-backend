const express = require("express");
const {
  getSingleProject,
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
} = require("../controllers/projectsController");
const { handleProjectsHeroImagesUpload } = require("../middleware/projectsImageMiddleware");
// const {
//   handleHeroImageUpload,
//   handleImageUpdate,
//   deleteFromFirebase,
// } = require("../middleware/projectsImageMiddleware");

const router = express.Router();

router.get("/", getAllProjects);

router.get("/:id", getSingleProject);

router.post("/", handleProjectsHeroImagesUpload, createProject);

router.delete("/:id", deleteProject);

router.patch("/:id", handleProjectsHeroImagesUpload, updateProject);

module.exports = router;
