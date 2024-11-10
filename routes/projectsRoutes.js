const express = require("express");
const {
  getSingleProject,
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
} = require("../controllers/projectsController");
// const { handleImageUpload } = require("../middleware/imageMiddleware");
const {
  handleHeroImageUpload,
  handleImageUpdate,
  deleteFromFirebase,
} = require("../middleware/projectsImageMiddleware");

const router = express.Router();

router.get("/", getAllProjects);

router.get("/:id", getSingleProject);

router.post("/", handleHeroImageUpload, createProject);

router.delete("/:id",deleteFromFirebase, deleteProject);

router.patch("/:id", handleImageUpdate, updateProject);

module.exports = router;
