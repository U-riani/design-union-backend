const express = require("express");
const {
  getSingleProject,
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
} = require("../controllers/projectsController");
const { handleImageUpload } = require("../middleware/imageMiddleware");

const router = express.Router();

router.get("/", getAllProjects);

router.get("/:id", getSingleProject);

router.post("/", handleImageUpload, createProject);

router.delete("/:id", deleteProject);

router.patch("/:id", handleImageUpload, updateProject);

module.exports = router;
