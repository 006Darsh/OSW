const Admin = require("../Models/Admin");
const Speaker = require("../Models/Speaker");

exports.AddSpeakers = async (req, res) => {
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
    const {
      name,
      post,
      university,
      city,
      state,
      pincode,
      about,
      social_links,
    } = req.body;
    if (
      !name ||
      !post ||
      !social_links ||
      !university ||
      !city ||
      !state ||
      !pincode ||
      !about
    ) {
      return res.status(400).json({
        success: false,
        message: "All details are required to add a team member !!!",
      });
    }

    const newSpeaker = new Speaker({
      name,
      post,
      university,
      "location.city": city,
      "location.state": state,
      "location.pincode": pincode,
      about,
      social_links,
      added_by: Id,
    });
    await newSpeaker.save();
    return res.status(200).send({
      success: true,
      Speaker: newSpeaker,
      message: "Speaker Added Successfully",
    });
  } catch (error) {
    console.error("Error in adding a Speaker:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while adding a speaker.",
    });
  }
};

exports.getallSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find(
      {},
      {
        _id: 1,
        name: 1,
        post: 1,
        university: 1,
        location: 1,
        about: 1,
        social_links: 1,
        sessions: 1,
      }
    );
    return res.status(200).send({ success: true, speakers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
