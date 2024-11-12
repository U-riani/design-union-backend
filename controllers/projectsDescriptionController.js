const Projects = require("../models/Projects");


const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

// // Get all heroes
// const getAllProjects = async (req, res) => {
//   try {
//     const projects = await Projects.find().populate({
//       path: "heroData",
//     });
//     // const allProjects =
//     return res.status(200).json(projects);
//   } catch (error) {
//     console.error("Error in getAllProjects:", error);
//     return res.status(500).json({ error, customError: "Error in getAll hero" });
//   }
// };

// // Get a single hero
// const getSingleProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const singleProject = await Projects.findById(id).populate({path: "heroData"});
//     if (!singleProject) {
//       return res.status(404).json({ message: "Project not found" });
//     }
//     return res.status(200).json(singleProject);
//   } catch (error) {
//     console.error("Error in getSingleProject:", error);
//     return res
//       .status(500)
//       .json({ error, customError: "Error in get single hero" });
//   }
// };

// Delete a hero
const deleteProjectDescription = async (req, res) => {
  try {
    const { id } = req.params;

    const singleProject = await Projects.findById(id);
    if (!singleProject) {
      return res.status(404).json({ message: "No such Project to delete" });
    }

    // Delete associated image(s) from Firebase
    if (singleProject.image && singleProject.image.length > 0) {
      await deleteFromFirebase(singleProject.image[0]);
    }

    await Projects.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProject:", error);
    return res.status(500).json(error);
  }
};

// Update a Project
const updateProjectDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      // name: {
      //   en: req.body.name.ge,
      //   ge: req.body.name.ge,
      // },
      // description: { 
      //   en: req.body.description.ge,
      //   ge: req.body.description.ge,
      // },
      mainProject: req.body.mainProject
    }; 

    // Find existing project document
    const singleProjectInfo = await Projects.findById(id);
    if (!singleProjectInfo) {
      return res.status(404).json({ message: "Project description not found to update" });
    }

    const updatedProject = await Projects.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Failed to update project description:", error);
    res.status(500).json({ message: "Failed to update project description", error });
  }
};
 
module.exports = {
  deleteProjectDescription,
  updateProjectDescription,
};
