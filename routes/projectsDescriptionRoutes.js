const express = require("express");
const {deleteProjectDescription, updateProjectDescription, updateProjectHeroData, createProjectsHeroData, deleteProjectsHerodata} = require('../controllers/projectsDescriptionController')
const { handleProjectsHeroImagesUpload } = require("../middleware/projectsImageMiddleware");
const { handleImageUpload } = require('../middleware/imageMiddleware');

const router = express.Router();


router.delete("/:id", deleteProjectDescription);
 
router.patch("/description/:id", updateProjectDescription);

router.patch("/heroData/:id", handleImageUpload, updateProjectHeroData);

router.post("/heroData/:id", handleImageUpload, createProjectsHeroData);

router.delete("/heroData/:id", deleteProjectsHerodata);

module.exports = router;
