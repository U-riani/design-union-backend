const express = require("express");
const {
  getSingleProject,
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
} = require("../controllers/projectsController");
const { handleImageUpload } = require("../middleware/imageMiddleware");
const { handleHeroImageUpload } = require("../middleware/projectsImageMiddleware");

const router = express.Router(); 

router.get("/", getAllProjects);

router.get("/:id", getSingleProject);

router.post("/", handleHeroImageUpload, createProject);

router.delete("/:id", deleteProject);

router.patch("/:id", handleHeroImageUpload, updateProject);

module.exports = router;
