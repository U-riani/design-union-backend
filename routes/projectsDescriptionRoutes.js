const express = require("express");
const {deleteProjectDescription, updateProjectDescription} = require('../controllers/projectsDescriptionController')
const router = express.Router();


router.delete("/:id", deleteProjectDescription);

router.patch("/description/:id", updateProjectDescription);

module.exports = router;
