const Admin = require("../Models/Admin");
const Team = require("../Models/Team");

exports.AddTeamMember = async (req, res) => {
  const Id = req.user._id;
  const admin = await Admin.findOne({ _id: Id });
  if (req.userType !== "admin") {
    return res.status(401).send({ success: false, message: "Not Authorized." });
  }
  if (!admin) {
    return res.status(400).send({
      success: false,
      message: "Admin account not found.",
    });
  }
  try {
    const { name, bio, post, social_links } = req.body;
    if (!name || !bio || !post || !social_links) {
      return res.status(400).json({
        success: false,
        message: "All details are required to add a team member !!!",
      });
    }

    const newTeamMember = new Team({
      name,
      bio,
      post,
      social_links,
      added_by: Id,
    });
    await newTeamMember.save();
    return res.status(200).send({
      success: true,
      team_member: newTeamMember,
      message: "Team Member Added Successfully",
    });
  } catch (error) {
    console.error("Error in adding a team member:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while adding a team member.",
    });
  }
};

exports.getallTeamMembers = async (req, res) => {
  try {
    const teams = await Team.find(
      {},
      {
        _id: 1,
        name: 1,
        bio: 1,
        post: 1,
        social_links: 1,
      }
    );
    return res.status(200).send({ success: true, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
