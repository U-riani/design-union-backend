const express = require("express");
const {
  getAboutUs,
  createAboutUs,
  updateAboutUs,
  createAboutUsMainPage,
  getAboutUsMainPage,
  updateAboutUsMainPage,
} = require("../controllers/aboutUsController");
const { handleImageUpload } = require("../middleware/imageMiddleware");

const router = express.Router();

router.get("/", getAboutUs);

router.post("/", handleImageUpload, createAboutUs);

router.patch("/", handleImageUpload, updateAboutUs);

router.get("/mainPage", getAboutUsMainPage);

router.post("/mainPage", handleImageUpload, createAboutUsMainPage);

router.patch("/mainPage", handleImageUpload, updateAboutUsMainPage);

module.exports = router;
