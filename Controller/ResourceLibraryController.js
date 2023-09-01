const Resource = require("../Models/ResouceLibrary");

exports.AddProject = async (req, res) => {
  try {
    const user = req.user;
    const { project_name, project_details, project_links } = req.body;
    if (req.usertype === "admin") {
      const newProject = new Resource({
        project_name,
        project_details,
        project_links,
      });
      const createdProject = await newProject.save();
      return res.status(200).json(createdProject);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};

exports.GetProjects = async (req, res) => {
  try {
    const projects = await Resource.find(
      {},
      {
        _id: 1,
        project_name: 1,
      }
    );
    return res.status(200).send({ success: true, projects });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};

exports.GetProjectDetails = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Resource.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }
    const responseData = {
      project_name: project.project_name,
      project_details: project.project_details,
      project_links: project.project_links,
    };
    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};

exports.UpdateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { project_name, project_details, project_links } = req.body;
    let project;
    if (req.usertype === "admin") {
      project = await Resource.findById(projectId);
    } else {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorized." });
    }
    if (project_name) {
      project.project_name = project_name;
    }
    if (project_details) {
      project.project_details = project_details;
    }
    if (project_links) {
      project.project_links = project_links;
    }
    project.updatedAt = Date.now();
    const updatedProject = await project.save();
    return res.status(200).json({ success: true, updatedProject });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};

exports.DeleteProject = async (req, res) => {
  if (req.usertype !== admin) {
    return res.status(401).send({ success: false, message: "Not Authorized." });
  }
  try {
    const projectId = req.params.id;
    const deletedProject = await Resource.findByIdAndDelete(projectId);
    if (!deletedProject) {
      return res
        .status(400)
        .json({ success: false, message: "Project not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};
