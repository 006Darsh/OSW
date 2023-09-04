const Resource = require("../Models/ResouceLibrary");
const { NotifyUsersProjects } = require("./NotificationController");

exports.AddProject = async (req, res) => {
  try {
    const { project_name, project_details, project_links } = req.body;
    if (req.userType !== "admin") {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorized." });
    }
    const newProject = new Resource({
      project_name,
      project_details,
      project_links,
    });
    const createdProject = await newProject.save();
    if (createdProject) {
      const title = "New Open Source Project Available";
      const content = `A new Open Source Project is available.\nProject Name is : ${newProject.project_name}.`;
      NotifyUsersProjects(newProject, content, title);
      return res.status(200).json({
        success: true,
        Project: createdProject,
      });
    }
    return res.status(200).json(createdProject);
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
    let content = `The Project "${project.project_name}" has been updated. Changes include:\n`;
    if (project_name !== project.project_name) {
      content += `- Project Name: ${Project.project_name} -> ${project_name}\n`;
      project.project_name = project_name;
    }
    if (project_details !== project.project_details) {
      content += `- Project Details: ${project.project_details} -> ${project_details}\n`;
      project.project_details = project_details;
    }
    if (project_links !== project.project_links) {
      project.project_links = project_links;
    }
    project.updatedAt = Date.now();
    const updatedProject = await project.save();
    if (updatedProject) {
      const title = "A project is updated";
      content += "\nCheck it out now!";
      NotifyUsersProjects(updatedProject, content, title);
    }
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
    if (deletedProject) {
      const title = "A Project is deleted";
      let content = `The Project ${deletedProject.project_name} has been deleted by the admin.`;
      NotifyUsersEvent(deletedProject, content, title);
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
