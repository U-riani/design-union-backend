const Projects = require("../models/Projects");
const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

// Get all heroes
const getAllProjects = async (req, res) => {
  try {
    const projects = await Projects.find();
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    return res.status(500).json({ error, customError: "Error in getAll hero" });
  }
};

// Get a single hero
const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;
    const singleProject = await Projects.findById(id);
    if (!singleProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json(singleProject);
  } catch (error) {
    console.error("Error in getSingleProject:", error);
    return res
      .status(500)
      .json({ error, customError: "Error in get single hero" });
  }
};

// Create a new Project
const createProject = async (req, res) => {
  try {
    const projectData = {
      name: {
        en: req.body.name.ge,
        ge: req.body.name.ge,
      },
      description: {
        en: req.body.description.ge,
        ge: req.body.description.ge,
      },
      heroText: {
        ge: req.body.heroText.ge,
        en: req.body.heroText.en,
      },
      mainProject: req.body.mainProject ,
      image: req.fileUrls || [], // Use `fileUrls` from middleware
    };

    const newProject = new Projects(projectData);
    await newProject.save();
    return res.status(200).json(newProject);
  } catch (error) {
    console.error("Error in createProject:", error);
    res.status(500).json({ error, customError: "Error in create projects" });
  }
};

// Delete a hero
const deleteProject = async (req, res) => {
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
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      name: {
        en: req.body.name.ge,
        ge: req.body.name.ge,
      },
      description: {
        en: req.body.description.ge,
        ge: req.body.description.ge,
      },
      heroText: {
        en: req.body.heroText.en,
        ge: req.body.heroText.ge,
      },
    };

    // Find existing hero document
    const singleProjectInfo = await Projects.findById(id);
    if (!singleProjectInfo) {
      return res.status(404).json({ message: "Project not found to update" });
    }

    // Handle image updates if new images are uploaded
    if (req.fileUrls && req.fileUrls.length > 0) {
      // Delete old image(s)
      if (singleProjectInfo.image && singleProjectInfo.image.length > 0) {
        await deleteFromFirebase(singleProjectInfo.image[0]);
      }

      // Set new images
      updatedData.image = req.fileUrls;
    }

    const updatedProject = await Projects.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Failed to update hero:", error);
    res.status(500).json({ message: "Failed to update hero", error });
  }
};

module.exports = {
  getSingleProject,
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
};
