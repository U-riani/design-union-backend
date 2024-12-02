const Projects = require("../models/Projects");
const HeroImage = require("../models/HeroImage");
const HeroData = require("../models/HeroData");
const ProjectContent = require("../models/ProjectContent");

const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

// Get all heroes
const getAllProjects = async (req, res) => {
  try {
    const projects = await Projects.find().populate([
      { path: "heroData" },
      { path: "projectContent" },
    ]);

    // const allProjects =
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    return res.status(500).json({ error, customError: "Error in getAll hero" });
  }
};

const getLastThreeProjects = async (req, res) => {
  try {
    const projects = await Projects.find()
      .sort({ date: -1 })
      .limit(3)
      .select("name _id")
      .populate([{ path: "heroData", select: 'image.url' }])

    // Map the projects to return the desired structure
    const formattedProjects = projects.map((project) => ({
      id: project._id,
      name: project.name,
      image: project.heroData?.[0]?.image?.url || null, // Safely access nested fields
    }));

    return res.status(200).json(formattedProjects);
  } catch (error) {
    console.error("Error in getA Last 3 projects:", error);
    return res.status(500).json({ error, customError: "Error in get last 3 projects" });
  }
};

const getAllprojectsImageTitleText = async (req, res) => {
  try {
    const projectsArr = [];
    const projects = await Projects.find().populate({ path: "heroData" });
    for (const proj of projects) {
      const nameImageTextId = {};
      nameImageTextId.id = proj._id;
      nameImageTextId.name = proj.name;
      nameImageTextId.text = proj.heroText;
      nameImageTextId.image = proj.heroData[0]?.image || "";
      projectsArr.push(nameImageTextId);
    }
    // const projects = await Projects.find()
    // .select('name') // Correctly reference nested fields
    // .populate({
    //   path: 'heroData',
    //   select: 'image.url', // Select specific fields for the populated data
    // });

    return res.status(200).json(projectsArr);
  } catch (error) {
    console.error("Error in getAllprojectsImageAndTitle:", error);
    return res
      .status(500)
      .json({ error, customError: "Error in getAll heross title and image" });
  }
};

// Get a single hero
const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;
    const singleProject = await Projects.findById(id).populate([
      { path: "heroData" },
      { path: "projectContent" },
    ]);
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

//       heroText: {
//         ge: req.body.heroText.ge,
//         en: req.body.heroText.en,
//       },
//       mainProject: req.body.mainProject ,
//       image: req.fileUrls || [], // Use `fileUrls` from middleware
//     };

//     const newProject = new Projects(projectData);
//     await newProject.save();
//     return res.status(200).json(newProject);
//   } catch (error) {
//     console.error("Error in createProject:", error);
//     res.status(500).json({ error, customError: "Error in create projects" });
//   }
// };
// const createProject = async (req, res) => {
//   try {
//     // Validate required fields

//     // Save image data first
//     console.log("sndr", req.files[0].originalname);
//     console.log("sndr111", req.fileUrls);
//     const imageUrls = []; // Array to store image document references
//     if (req.fileUrls && req.fileUrls.length > 0) {

//       req.fileUrls.map(async (el, i) => {

//         console.log("Saving image:", el); // Log for debugging

//         const imageUrl = el || el.path; // Use `file.url` for cloud uploads (Firebase, S3) or `file.path` for local files
//         if (!imageUrl) {
//           return res.status(400).json({
//             error: `File--${el.url}  --- ${el.path} -- Image URL or file path is required.`,
//           });
//         }
//         const newImage = new HeroImage({
//           url: el, // URL or path to the uploaded image
//           fileName: req.files[0].originalname, // Original file name
//         });

//         const savedImage = await newImage.save(); // Save the HeroImage document
//         imageUrls.push(savedImage._id); // Store the reference to the image document
//       });
//     }

//     // Create the heroData entry
//     const newHeroData = new HeroData({
//       heroText: req.body.heroText,
//       images: imageUrls, // Add the image references here
//     });

//     const savedHeroData = await newHeroData.save(); // Save HeroData

//     // Create the project with the heroData reference
//     const projectData = {
//       name: {
//         ge: req.body.name.ge,
//         en: req.body.name.en,
//       },
//       description: {
//         ge: req.body.description.ge,
//         en: req.body.description.en,
//       },
//       heroData: [savedHeroData._id], // Add the heroData reference here
//       mainProject: req.body.mainProject,
//     };

//     const newProject = new Projects(projectData);
//     await newProject.save(); // Save the Project

//     return res.status(200).json(newProject); // Return the created project
//   } catch (error) {
//     console.error("Error in createProject:", error);
//     return res
//       .status(500)
//       .json({ error: error.message, customError: "Error in creating project" });
//   }
// };
// const createProject = async (req, res) => {
//   try {
//     const { name, description, heroes, mainProject } = req.body;
//     const heroDataIds = [];

//     for (const el of heroes) {
//       const heroData = {
//         heroText: {
//           ge: el.heroText.ge,
//           en: el.heroText.en,
//         },
//         image: {
//           url: el.image.url, // Ensure `url` field matches schema requirements
//           fileName: el.image.fileName, // Ensure `fileName` field matches schema requirements
//         },
//       };

//       const newHeroData = new HeroData(heroData);
//       await newHeroData.save();
//       heroDataIds.push(newHeroData._id);
//     }

//     // Create the project with heroData references
//     const projectData = {
//       name: {
//         ge: req.body.name.ge,
//         en: req.body.name.en,
//       },
//       description: {
//         ge: req.body.description.ge,
//         en: req.body.description.en,
//       },
//       heroData: heroDataIds, // Use the array of heroData IDs
//       mainProject: req.body.mainProject,
//     };

//     const newProject = new Projects(projectData);
//     await newProject.save();

//     return res.status(200).json(newProject);
//   } catch (error) {
//     console.error("Error in createProject:", error);
//     return res
//       .status(500)
//       .json({ error: error.message, customError: "Error in creating project" });
//   }
// };
// const createProject = async (req, res) => {
//   try {
//     const { name, description, mainProject } = req.body;
//     const heroDataIds = [];
//     console.log(req.body);

//     // Ensure that the image URLs and filenames are available from the middleware
//     const uploadedImageDetails = req.uploadedImageDetails || [];

//     const newData = {
//       heroText: {
//         ge: req.body.heroText.ge,
//         en: req.body.heroText.en,
//       },
//       image: {
//         // Use the image details from the middleware
//         url: req.fileUrls[0],
//       },
//     };

//     // Create and save HeroData instance
//     const newHeroData = new HeroData(newData);
//     await newHeroData.save();
//     heroDataIds.push(newHeroData._id); // Store the heroData ID

//     // Create the project with the HeroData references
//     const projectData = {
//       name: {
//         ge: name.ge,
//         en: name.en,
//       },
//       description: {
//         ge: description.ge,
//         en: description.en,
//       },
//       heroData: heroDataIds, // References to HeroData documents
//       mainProject: mainProject || false,
//     };

//     // Save the new project
//     const newProject = new Projects(projectData);
//     await newProject.save();

//     return res.status(200).json(newProject);
//   } catch (error) {
//     console.error("Error in createProject:", error);
//     return res
//       .status(500)
//       .json({ error: error.message, customError: "Error in creating project" });
//   }
// };

// Delete a hero
const createProject = async (req, res) => {
  try {
    const { name, description, mainProject } = req.body;
    const heroDataIds = [];

    // Process hero data
    const newData = {
      heroText: {
        ge: req.body.heroText.ge,
        en: req.body.heroText.en,
      },
      image: {
        url: req.fileUrls[0],
      }, // Use all uploaded image URLs
    };

    // Save HeroData instance and store its ID
    const newHeroData = new HeroData(newData);
    await newHeroData.save();
    heroDataIds.push(newHeroData._id); // Store the heroData ID

    // Prepare and save project with HeroData references
    const projectData = {
      name: {
        ge: name.ge,
        en: name.en,
      },
      description: {
        ge: description.ge,
        en: description.en,
      },
      heroData: heroDataIds, // References to HeroData documents
      mainProject: mainProject || false,
    };

    const newProject = new Projects(projectData);
    await newProject.save();

    return res.status(200).json({ url: req.fileUrls[0] });
  } catch (error) {
    console.error("Error in createProject:", error);
    return res.status(500).json({ error: error.message });
  }
};

// const deleteProject = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const singleProject = await Projects.findById(id);
//     if (!singleProject) {
//       return res.status(404).json({ message: "No such Project to delete" });
//     }

//     for (const heroDataId of singleProject.heroData) {
//       const heroData = await HeroData.findByIdAndDelete(heroDataId);
//       // // Delete associated image(s) from Firebase
//       if (heroData && heroData.image && heroData.image.url) {
//         await deleteFromFirebase(heroData.image.url);
//       }
//     }

//     const projectContentsId = singleProject.projectContent;
//     if (!projectContentsId) {
//       return res.status(404).json({ message: "No project COntents" });
//     }

//     for (const projectContentId of projectContentsId) {
//       const projectContentDoc = await ProjectContent.findById(projectContentId);
//       if (
//         projectContentDoc.media &&
//         projectContentDoc.media.images &&
//         projectContentDoc.media.images.length > 0
//       ) {
//         for (const image of projectContentDoc.media.images) {
//           await deleteFromFirebase(image.url);
//         }
//       }
//       await ProjectContent.findByIdAndDelete(projectContentId);
//       // singleProject.projectContent.shift();

//       // await singleProject.save();
//     }

//     await Projects.findByIdAndDelete(id);

//     res
//       .status(200)
//       .json({ message: "Project deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteProject:", error);
//     return res.status(500).json(error);
//   }
// };

// Update a Project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project to be deleted
    const singleProject = await Projects.findById(id);
    if (!singleProject) {
      return res.status(404).json({ message: "No such Project to delete" });
    }

    // Delete associated HeroData and images from Firebase
    if (singleProject.heroData || singleProject.heroData.length > 0) {
      for (const heroDataId of singleProject.heroData) {
        const heroData = await HeroData.findByIdAndDelete(heroDataId);
        if (heroData && heroData.image && heroData.image.url) {
          await deleteFromFirebase(heroData.image.url);
        }
      }
    }

    // Check if there are associated projectContents
    const projectContentsId = singleProject.projectContent;
    if (projectContentsId || projectContentsId.length > 0) {
      // return res.status(404).json({ message: "No project contents to delete" });

      // Delete associated ProjectContent and images from Firebase
      for (const projectContentId of projectContentsId) {
        const projectContentDoc = await ProjectContent.findById(
          projectContentId
        );
        if (projectContentDoc) {
          // Delete images from Firebase if they exist
          if (
            projectContentDoc.media &&
            projectContentDoc.media.images &&
            projectContentDoc.media.images.length > 0
          ) {
            for (const image of projectContentDoc.media.images) {
              await deleteFromFirebase(image.url);
            }
          }

          // Delete the project content document
          await ProjectContent.findByIdAndDelete(projectContentId);
        }
      }
    }

    // Finally, delete the project itself
    await Projects.findByIdAndDelete(id);

    // Return success message
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProject:", error);
    return res.status(500).json({ message: "Error deleting project", error });
  }
};

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
    };

    // Find existing project document
    const singleProjectInfo = await Projects.findById(id);
    if (!singleProjectInfo) {
      return res.status(404).json({ message: "Project not found to update" });
    }

    // // Handle image updates if new images are uploaded
    // if (req.fileUrls && req.fileUrls.length > 0) {
    //   // Delete old image(s)
    //   if (singleProjectInfo.image && singleProjectInfo.image.length > 0) {
    //     await deleteFromFirebase(singleProjectInfo.image[0]);
    //   }

    //   // Set new images
    //   updatedData.image = req.fileUrls;
    // }

    const updatedProject = await Projects.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    res.status(500).json({ message: "Failed to update project", error });
  }
};

module.exports = {
  getAllprojectsImageTitleText,
  getLastThreeProjects,
  getSingleProject,
  getAllProjects,
  createProject,
  deleteProject,
  updateProject,
};
