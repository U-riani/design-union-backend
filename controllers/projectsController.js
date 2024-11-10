const Projects = require("../models/Projects");
const { deleteFromFirebase } = require("../middleware/projectsImageMiddleware"); // Import the delete function

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
// const createProject = async (req, res) => {
//   try {
//     const projectData = {
//       name: {
//         ge: req.body.name.ge,
//         en: req.body.name.en,
//       },
//       description: {
//         ge: req.body.description.ge,
//         en: req.body.description.en,
//       },
//       heroData: req.body.heroData,
//       // heroData: req.body.heroText.ge.map((_, index) => ({
//       //   heroText: {
//       //     ge: req.body.heroText.ge[index],
//       //     en: req.body.heroText.en[index],
//       //   },
//       //   image: req.fileUrls[index], // assuming multiple file URLs
//       // })),
//       mainProject: req.body.mainProject,
//     };

//     const newProject = new Projects(projectData);
//     await newProject.save();
//     return res.status(200).json(newProject);
//   } catch (error) {
//     console.error("Error in createProject:", error);
//     res.status(500).json({ error, customError: "Error creating project" });
//   }
// };
const createProject = async (req, res) => {
  try {
    const projectData = {
      name: req.body.name,
      description: req.body.description,
      mainProject: req.body.mainProject,
      heroData: req.body.heroData.map((hero, index) => ({
        heroText: hero.heroText,
        image: req.fileUrls[index], // This assumes images correspond to `heroData` entries
      })),
    };

    const newProject = new Projects(projectData);
    await newProject.save();
    res.status(200).json(newProject);
  } catch (error) {
    console.error("Error in createProject:", error);
    res.status(500).json({ error, message: "Error creating project" });
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

    // Delete each image associated with the project from Firebase
    for (const hero of singleProject.heroData) {
      console.log(hero);
      await deleteFromFirebase(hero.image[0]);
    }

    await Projects.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProject:", error);
    return res.status(500).json(error);
  }
};

// Update a Project
// Update a Project
// const updateProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const existingProject = await Projects.findById(id);

//     if (!existingProject) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // Prepare updated data for the project
//     const updatedData = {
//       name: {
//         ge: req.body.name.ge,
//         en: req.body.name.en,
//       },
//       description: {
//         ge: req.body.description.ge,
//         en: req.body.description.en,
//       },
//       mainProject: req.body.mainProject,
//       heroData: [],
//     };

//     // Handle new or existing heroData
//     req.body.heroText.ge.forEach((_, index) => {
//       const hero = {
//         heroText: {
//           ge: req.body.heroText.ge[index],
//           en: req.body.heroText.en[index],
//         },
//         image: req.fileUrls && req.fileUrls[index] ? req.fileUrls[index] : existingProject.heroData[index]?.image || [],
//       };

//       updatedData.heroData.push(hero);
//     });

//     // If new images were uploaded, delete old images first
//     if (req.fileUrls) {
//       for (let i = 0; i < existingProject.heroData.length; i++) {
//         if (existingProject.heroData[i].image && req.fileUrls[i]) {
//           for (const oldImageUrl of existingProject.heroData[i].image) {
//             await deleteFromFirebase(oldImageUrl); // Delete old image from Firebase
//           }
//         }
//       }
//     }

//     // Update the project in the database
//     const updatedProject = await Projects.findByIdAndUpdate(id, updatedData, {
//       new: true,
//     });

//     res.status(200).json(updatedProject);
//   } catch (error) {
//     console.error("Error in updateProject:", error);
//     res.status(500).json({ message: "Error updating project", error });
//   }
// };
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the existing project by ID
    const existingProject = await Projects.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Prepare the updated project data
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      mainProject: req.body.mainProject,
      heroData: [], // Initialize as empty array
    };

    // Loop through heroData from the request body and update each item
    req.body.heroData.forEach((item, index) => {
      const hero = {
        heroText: {
          ge: item.heroText.ge,
          en: item.heroText.en,
        },
        image:
          req.fileUrls && req.fileUrls[index] // New image if uploaded
            ? req.fileUrls[index]
            : existingProject.heroData[index]?.image || [], // Keep existing image if no new one
      };

      updatedData.heroData.push(hero); // Push updated hero object into heroData array
    });

    // Delete old images only when new ones are uploaded
    if (req.fileUrls) {
      for (let i = 0; i < existingProject.heroData.length; i++) {
        if (existingProject.heroData[i].image && req.fileUrls[i]) {
          // If a new image is uploaded, delete old images from Firebase
          for (const oldImageUrl of existingProject.heroData[i].image) {
            await deleteFromFirebase(oldImageUrl);
          }
        }
      }
    }

    // Update the project with the new data
    const updatedProject = await Projects.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
    });

    // Return the updated project data in the response
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error in updateProject:", error);
    res.status(500).json({ message: "Error updating project", error });
  }
};

module.exports = {
  getSingleProject,
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
};
