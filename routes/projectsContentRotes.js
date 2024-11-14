const express = require("express");
const {
  createProjectContentTitle,
  updateProjectContentTitle,
  createProjectContentImage,
  deleteProjectContentImage,
  updateProjectContentImage,
  deleteProjectContent,
  updateProjectContent,
  updateProjectContentVideo
} = require("../controllers/projectContentController");

const router = express.Router();

router.post("/projectContentTitle/:id", createProjectContentTitle);

router.patch("/projectContentTitle/:id", updateProjectContentTitle);

router.post("/projectContetnImage/:id", createProjectContentImage);

router.post("/projectContetnVideo/:id", updateProjectContentVideo);

router.patch("/projectContetnVideo/:id", updateProjectContentVideo);

router.delete("/projectContetnImage/:id", deleteProjectContentImage);

router.patch("/projectContetnImage/:id", updateProjectContentImage);

router.delete("/projectContent/:id", deleteProjectContent);

router.patch("/projectContent/:id", updateProjectContent);

module.exports = router;
