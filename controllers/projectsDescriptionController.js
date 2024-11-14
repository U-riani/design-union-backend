const Projects = require("../models/Projects");
const HeroData = require("../models/HeroData");

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
    const reqBody = req.body;
    const updatedData = {
      name: {
        en: req.body.name.en,
        ge: req.body.name.ge,
      },
      description: {
        en: req.body.description.en,
        ge: req.body.description.ge,
      },
      mainProject: req.body.mainProject,
    };

    // Find existing project document
    const singleProjectInfo = await Projects.findById(id);
    if (!singleProjectInfo) {
      return res
        .status(404)
        .json({ message: "Project description not found to update" });
    }

    const updatedProject = await Projects.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Failed to update project description:", error);
    res
      .status(500)
      .json({ message: "Failed to update project description", error });
  }
};
// Update a Project
// const updateProjectHeroData = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const index = req.body.index;

//     // const updatedData = {
//     //   heroText: {
//     //     en: req.body.heroText.en,
//     //     ge: req.body.heroText.ge,
//     //   },
//     //   image: req.fileUrls,
//     // };

//     // Find existing project document
//     // const singleProjectInfo = await Projects.findById(id);
//     // if (!singleProjectInfo) {
//     //   return res
//     //     .status(404)
//     //     .json({ message: "Project description not found in projectsHeroData controller" });
//     // }

//     // const heroDataId = await HeroData.findById({ id: singleProjectInfo.heroData[index] });

//     // if (!heroDataId) {
//     //   return res
//     //     .status(404)
//     //     .json({ message: "heroDataId in projectsDescription not found to update heroData" });
//     // }
//     // const updatedProjectsHeroData = await Projects.findByIdAndUpdate(heroDataId, updatedData, {
//     //   new: true,
//     //   runValidators: true,
//     // });

//     const myData = await req.body.projectId;

//     res
//       .status(200)
//       .json({ index: index || `${id} -- id`, myData: myData || "ddd" });
//   } catch (error) {
//     console.error("Failed to update projects HeroData:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to update projectHero data", error });
//   }
// };
// const updateProjectHeroData = async (req, res) => {
//   try {
//     const { id } = req.params; // ID of the project
//     const index = req.body.index; // Index of the heroData to update
//     const oldUrl = await req.body.url;
//     // const imageInfo = req.body.myImage.fileName || 'nope'
//     // const uploadedImageDetails = req.uploadedImageDetails || [];

//     const updatedHeroData = {
//       heroText: {
//         en: req.body.heroText.en,
//         ge: req.body.heroText.ge,
//       },
//       image: {
//         url: req.body.url,
//       },
//     };

//     // Find the project document by ID
//     const project = await Projects.findById(id);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // Ensure the index is within bounds
//     if (index < 0 || index >= project.heroData.length) {
//       return res.status(400).json({ message: "Invalid heroData index" });
//     }

//     // Get the specific heroData ID at the specified index
//     const heroDataId = project.heroData[index];

//     if (!heroDataId) {
//       return res.status(404).json({ message: "HeroDataId  not found" });
//     }
//     if (req.fileUrls && req.fileUrls.length > 0) {
//       // delete old image
//       await deleteFromFirebase(updatedHeroData.image.url);

//       console.log("---- req file urls");

//       // Set new images
//       updatedHeroData.image.url = req.fileUrls[0];
//     }

//     // Update the HeroData document
//     const updatedHeroDataDocument = await HeroData.findByIdAndUpdate(
//       heroDataId,
//       updatedHeroData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedHeroDataDocument) {
//       return res.status(404).json({ message: "HeroData item not found" });
//     }

//     res.status(200).json({
//       message: "HeroData updated successfully",
//       updatedHeroData: updatedHeroDataDocument,
//       heroDataId,
//       index,
//       url: oldUrl,
//     });
//   } catch (error) {
//     console.error("Failed to update project's HeroData:", error);
//     res.status(500).json({ message: "Failed to update HeroData", error });
//   }
// };
const updateProjectHeroData = async (req, res) => {
  try {
    const { id } = req.params; // Project ID
    const index = req.body.index; // Index for heroData update
    const oldUrl = req.body.oldUrl; // Original URL to delete from Firebase

    // Construct updated hero data
    const updatedHeroData = {
      heroText: {
        en: req.body.heroText?.en || "",
        ge: req.body.heroText?.ge || "",
      },
      image: {
        url: req.body.url, // New image URL (from request body or req.fileUrls)
      },
    };

    // Find the project document by ID
    const project = await Projects.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the index is within bounds
    if (index < 0 || index >= project.heroData.length) {
      return res.status(400).json({ message: "Invalid heroData index" });
    }

    // Get the specific heroData ID at the specified index
    const heroDataId = project.heroData[index];
    if (!heroDataId) {
      return res.status(404).json({ message: "HeroDataId not found" });
    }

    const oldHeroData = await HeroData.findById(heroDataId);
    // If new image URLs are present, delete the old image using the old URL
    if (req.fileUrls && req.fileUrls.length > 0) {
      await deleteFromFirebase(oldHeroData.image.url); // Delete the old image
      updatedHeroData.image.url = req.fileUrls[0]; // Set the new image URL
    }

    // Update the HeroData document in the database
    const updatedHeroDataDocument = await HeroData.findByIdAndUpdate(
      heroDataId,
      updatedHeroData,
      { new: true, runValidators: true }
    );

    if (!updatedHeroDataDocument) {
      return res.status(404).json({ message: "HeroData item not found" });
    }

    // Send successful response
    res.status(200).json({
      message: "HeroData updated successfully",
      updatedHeroData: updatedHeroDataDocument,
      heroDataId,
      index,
      oldHeroData,
      oldUrl,
      url: updatedHeroData.image.url,
    });
  } catch (error) {
    console.error("Failed to update project's HeroData:", error);
    res.status(500).json({ message: "Failed to update HeroData", error });
  }
};

const createProjectsHeroData = async (req, res) => {
  try {
    const { id } = req.params; // Project ID
    const newHeroData = {
      heroText: {
        en: req.body.heroText?.en || "",
        ge: req.body.heroText?.ge || "",
      },
      image: {
        url: req.fileUrls[0], // New image URL (from request body or req.fileUrls)
      },
    };

    const heroData = await HeroData.create(newHeroData);

    await Projects.findByIdAndUpdate(
      id,
      { $push: { heroData: heroData._id } },
      { new: true } // Returns the updated document
    );

    res.status(200).json({
      message: "HeroData created and added to project successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error, customError: "error in createProjectsHeroData" });
  }
};

const deleteProjectsHerodata = async (req, res) => {
  try {
    const { id } = req.params; // Project ID
    const { index } = req.query;
    const singleProject = await Projects.findById(id);
    if (!singleProject) {
      return res.status(404).json({ message: "No such Project to delete" });
    }

    const heroDataId = singleProject.heroData[index];
    if (!heroDataId) {
      return res.status(404).json({ message: "HeroDataId not found" });
    }

    console.log(heroDataId)

    // // Delete associated image(s) from Firebase
    const heroData = await HeroData.findById(heroDataId);
    if (heroData && heroData.image && heroData.image.url) {
      await deleteFromFirebase(heroData.image.url);
    }else {
      res.json({error: 'error in deleting images'})
    }

    //Delete the HeroData document
    await HeroData.findByIdAndDelete(heroDataId);


    // // Remove the reference from the project's heroData array
    singleProject.heroData.splice(index, 1);
    await singleProject.save();


    // await HeroData.findByIdAndDelete(heroDataId);
    res.status(200).json({ message: "ProjectHeroData deleted successfully" , index, id, heroDataId});
  } catch (error) {
    res
      .status(500)
      .json({ error, customError: "Error in deleteProjectsHerodata" });
  }
};

module.exports = {
  deleteProjectDescription,
  updateProjectDescription,
  updateProjectHeroData,
  createProjectsHeroData,
  deleteProjectsHerodata
};
