const Projects = require("../models/Projects");
const ProjectContent = require("../models/ProjectContent");
const ProjectContentImage = require("../models/ProjectContentImages");

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
  const {index} = req.body
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
}

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

    return res
      .status(200)
      .json({
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

const createProjectContentImage = async (req, res) => {
  const { id } = req.params();
  try {
    return res.status(200).json({ message: "createProjectContentImage" });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error createProjectContentImage" });
  }
};

const deleteProjectContentImage = async (req, res) => {
  const { id } = req.params();
  try {
    return res.status(200).json({ message: "deleteProjectContentImage" });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error deleteProjectContentImage" });
  }
};
const updateProjectContentImage = async (req, res) => {
  const { id } = req.params();
  try {
    return res.status(200).json({ message: "updateProjectContentImage" });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error updateProjectContentImage" });
  }
};

const deleteProjectContent = async (req, res) => {
  const { id } = req.params();
  try {
    return res.status(200).json({ message: "deleteProjectContent" });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error deleteProjectContent" });
  }
};
const updateProjectContent = async (req, res) => {
  const { id } = req.params();
  try {
    return res.status(200).json({ message: "updateProjectContent" });
  } catch (error) {
    return res
      .status(404)
      .json({ error, message: "Error updateProjectContent" });
  }
};

module.exports = {
  createProjectContentTitle,
  updateProjectContentTitle,
  createProjectContentImage,
  deleteProjectContentImage,
  updateProjectContentImage,
  deleteProjectContent,
  updateProjectContent,
//   createProjectContentVideo,
  updateProjectContentVideo,

};
