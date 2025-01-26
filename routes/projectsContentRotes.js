const express = require("express");
const {
  createProjectContentTitle,
  updateProjectContentTitle,
  //   createProjectContentImage,
  deleteProjectContentImage,
  updateProjectContentImage,
  deleteProjectContent,
  updateProjectContent,
  updateProjectContentVideo,
  getSingleProjectContent,
} = require("../controllers/projectContentController");
const { handleImageUpload } = require("../middleware/imageMiddleware");
const thumbnailUrlMiddleware = require("../middleware/thumbnailMiddleware");

const router = express.Router();

router.post("/projectContentTitle/:id", createProjectContentTitle);

router.patch("/projectContentTitle/:id", updateProjectContentTitle);

router.post(
  "/projectContetnVideo/:id",
  thumbnailUrlMiddleware,
  updateProjectContentVideo
);

router.patch(
  "/projectContetnVideo/:id",
  thumbnailUrlMiddleware,
  updateProjectContentVideo
);

router.patch(
  "/projectContetnImage/:id",
  handleImageUpload,
  updateProjectContentImage
);

router.delete("/projectContetnImage/:id", deleteProjectContentImage);

// router.patch("/projectContetnImage/:id", handleImageUpload, updateProjectContentImage);

router.delete("/projectContent/:id", deleteProjectContent);

router.patch("/projectContent/:id", updateProjectContent);

router.get("/projectContent/:id", getSingleProjectContent);

module.exports = router;
