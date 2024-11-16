const Projects = require("../models/Projects");
const ProjectContent = require("../models/ProjectContent");
const ProjectContentImage = require("../models/ProjectContentImages");
const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

const getSingleProjectContent = async (req, res) => {
  const { id } = req.params;
  const { index } = req.query;

  try {
    const project = await Projects.findById(id);
    if (!project) {
      return res.status(500).json({ message: "No such project" });
    }

    const projectContentId = project.projectContent[index];
    if (!projectContentId) {
      return res
        .status(404)
        .json({ message: "No such content at specified index" });
    }

    const projectContent = await ProjectContent.findById(projectContentId);
    if (!projectContent) {
      return res.status(404).json({ message: "No such project content" });
    }

    res.status(200).json(projectContent);
  } catch (error) {
    res.status(404).json({ error, message: "Error in singleproject content" });
  }
};

const createProjectContentTitle = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const content = {
      title: {
        ge: title.ge,
        en: title.en,
      },
    };

    const newContent = new ProjectContent(content);
    await newContent.save();

    const project = await Projects.findById(id);
    if (!project) {
      return res.status(500).json({ message: "No such project" });
    }

    project.projectContent.push(newContent._id);
    await project.save();

    return res.status(200).json({
      message: "createProjectContent successfully",
      project,
      newProject: newContent._id,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error creating project content" });
  }
};

const updateProjectContentTitle = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const { index } = req.body;
  try {
    // const content = {
    //   title: {
    //     ge: title.ge,
    //     en: title.en,
    //   },
    // };

    const project = await Projects.findById(id);
    if (!project) {
      return res.status(500).json({ message: "No such project" });
    }

    const projectContentId = project.projectContent[index];
    if (!projectContentId) {
      return res
        .status(404)
        .json({ message: "No such content at specified index" });
    }

    // Find and update the specific ProjectContent document
    const projectContent = await ProjectContent.findById(projectContentId);
    if (!projectContent) {
      return res.status(404).json({ message: "No such project content" });
    }

    // update title
    projectContent.title = title;
    await projectContent.save();

    return res.status(200).json({
      message: "updated ProjectContent successfully",
      project,
      projectContent,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error updating project content title" });
  }
};

// const createProjectContentVideo = async (req, res) => {
//   const { id } = req.params;
//   const { video } = req.body;
//   const { index } = req.body;

//   try {
//     const project = await Projects.findById(id);

//     if (!project) {
//       return res.status(500).json({ message: "No such project" });
//     }

//     const projectContentId = project.projectContent[index];
//     if (!projectContentId) {
//       return res
//         .status(404)
//         .json({ message: "No such content at specified index" });
//     }

//     // Find and update the specific ProjectContent document
//     const projectContent = await ProjectContent.findById(projectContentId);
//     if (!projectContent) {
//       return res.status(404).json({ message: "No such project content" });
//     }

//     // Push the new video URL to the youtube array in the media field
//     projectContent.media.youtube = video;
//     await projectContent.save();

//     return res
//       .status(200)
//       .json({
//         message: "createProjectContentImage",
//         project,
//         updatedContent: projectContent,
//       });
//   } catch (error) {
//     return res
//       .status(404)
//       .json({ error, message: "Error createProjectContentImage" });
//   }
// };

const updateProjectContentVideo = async (req, res) => {
  const { id } = req.params;
  const { video } = req.body;
  const { index } = req.body;

  try {
    const project = await Projects.findById(id);

    if (!project) {
      return res.status(500).json({ message: "No such project" });
    }

    const projectContentId = project.projectContent[index];
    if (!projectContentId) {
      return res
        .status(404)
        .json({ message: "No such content at specified index" });
    }

    // Find and update the specific ProjectContent document
    const projectContent = await ProjectContent.findById(projectContentId);
    if (!projectContent) {
      return res.status(404).json({ message: "No such project content" });
    }

    // Push the new video URL to the youtube array in the media field
    projectContent.media.youtube = video;
    await projectContent.save();

    return res.status(200).json({
      message: "createProjectContentImage",
      project,
      updatedContent: projectContent,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error createProjectContentImage" });
  }
};

// const createProjectContentImage = async (req, res) => {
//     const { id } = req.params;
//     const { index } = req.body;
//   try {
//     const newImage = {url: req.fileUrls[0]};

//     const project = await Projects.findById(id);
//     if (!project) {
//       return res.status(500).json({ message: "No such project" });
//     }

//     const projectContentId = project.projectContent[index];
//     if (!projectContentId) {
//       return res
//         .status(404)
//         .json({ message: "No such content at specified index" });
//     }

//     // Find and update the specific ProjectContent document
//     const projectContent = await ProjectContent.findById(projectContentId);
//     if (!projectContent) {
//       return res.status(404).json({ message: "No such project content" });
//     }

//       projectContent.media.images.push(newImage)

//     return res.status(200).json({ message: "createProjectContentImage", index, id, newImage });
//   } catch (error) {
//     return res
//       .status(404)
//       .json({ error, message: "Error createProjectContentImage" });
//   }
// };

const updateProjectContentImage = async (req, res) => {
  const { id } = req.params;
  const { index } = req.body;
  const { localIndex } = req.body;
  const { type } = req.body;

  try {
    const project = await Projects.findById(id);
    if (!project) return res.status(500).json({ message: "No such project" });

    const projectContentId = project.projectContent[index];
    if (!projectContentId) {
      return res
        .status(404)
        .json({ message: "No such content at specified index" });
    }

    const projectContent = await ProjectContent.findById(projectContentId);
    if (!projectContent)
      return res.status(404).json({ message: "No such project content" });

    //   // Add or update images based on request body
    if (req.fileUrls) {
      if (type === "create") {
        projectContent.media.youtube = "";
        projectContent.media.images.push({ url: req.fileUrls[0] });
      }
      if (type === "update") {
        await deleteFromFirebase(projectContent.media.images[localIndex].url);
        projectContent.media.images[localIndex].url = req.fileUrls[0];
      }
    }

    await projectContent.save();

    return res
      .status(200)
      .json({
        message: "Image(s) updated",
        id,
        index,
        projectContent,
        localIndex,
        imageFile: projectContent.media.images[localIndex],
        middleWare: req.fileUrls[0],
      });
  } catch (error) {
    return res
      .status(500)
      .json({ error, message: "Error updating project content images" });
  }
};

const deleteProjectContentImage = async (req, res) => {
  const { id } = req.params;
  const { index, localIndex } = req.query; // const { localIndex } = req.body;

  try {
    const project = await Projects.findById(id);
    if (!project) {
      return res.status(500).json({ message: "No such project" });
    }

    const projectContentId = project.projectContent[index];
    if (!projectContentId) {
      return res
        .status(404)
        .json({ message: "No such content at specified index" });
    }

    // // Find and update the specific ProjectContent document
    const projectContent = await ProjectContent.findById(projectContentId);
    if (!projectContent) {
      return res.status(404).json({ message: "No such project content" });
    }

    const image = projectContent.media.images[localIndex];
    // //Delete image rom firebase
    await deleteFromFirebase(image.url);
    // remove array
    projectContent.media.images.splice(localIndex, 1);

    await projectContent.save();

    return res
      .status(200)
      .json({ message: "deleteProjectContentImage", image, projectContent });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error deleteProjectContentImage" });
  }
};

// const updateProjectContentImage = async (req, res) => {
//   const { id } = req.params;
//   const {index} = req.body;
//   try {
//     return res.status(200).json({ message: "updateProjectContentImage" });
//   } catch (error) {
//     return res
//       .status(404)
//       .json({ error, message: "Error updateProjectContentImage" });
//   }
// };

const deleteProjectContent = async (req, res) => {
  const { id } = req.params;
  const {index} = req.query;
  try {
    const project = await Projects.findById(id);
    if (!project) {
      return res.status(500).json({ message: "No such project" });
    }

    // Find and delete the specific ProjectContent document
    const projectContentId = project.projectContent[index];
    if (!projectContentId) {
      return res
        .status(404)
        .json({ message: "No such content at specified index" });
    }

    // // Find and update the specific ProjectContent document
    const projectContent = await ProjectContent.findById(projectContentId);
    if (!projectContent) {
      return res.status(404).json({ message: "No such project content" });
    }

    if(projectContent.media && projectContent.media.images && projectContent.media.images.length > 0)  {
      for(const image of projectContent.media.images) {
       await deleteFromFirebase(image.url)
      }
    }

    await ProjectContent.findByIdAndDelete(projectContentId);

    project.projectContent.splice(index, 1);

    await project.save()



    return res.status(200).json({ message: "deleteProjectContent", projectContent });
  } catch (error) {
    return res
      .status(500)
      .json({ error, message: "Error deleteProjectContent" });
  }
};
const updateProjectContent = async (req, res) => {
  const { id } = req.params;
  try {
    return res.status(200).json({ message: "updateProjectContent" });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error updateProjectContent" });
  }
};

module.exports = {
  getSingleProjectContent,
  createProjectContentTitle,
  updateProjectContentTitle,

  //   createProjectContentImage,
  deleteProjectContentImage,
  updateProjectContentImage,
  deleteProjectContent,
  updateProjectContent,
  //   createProjectContentVideo,
  updateProjectContentVideo,
};
