const Admin = require("../Models/Admin");
const Event = require("../Models/Event");
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
    const fileUrl = req.fileUrl;
    if (!fileUrl) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
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
      pic: fileUrl,
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
        pic: 1,
      }
    );
    return res.status(200).send({ success: true, speakers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.getspeakerDetails = async (req, res) => {
  try {
    const speakerId = req.params.id;
    const speaker = await Speaker.findById(speakerId).populate({
      path: "sessions",
      select: "event_name",
    });
    if (!speaker) {
      return res
        .status(404)
        .json({ success: false, message: "Speaker not found." });
    }

    // Extract event names from the populated sessions
    const eventSessions = speaker.sessions.map((session) => ({
      _id: session._id,
      event_name: session.event_name,
    }));

    const responseData = {
      name: speaker.name,
      post: speaker.post,
      university: speaker.university,
      location: speaker.location,
      about: speaker.about,
      social_links: speaker.social_links,
      sessions: eventSessions, // Replace with the extracted event names
      pic: speaker.pic,
    };
    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


exports.deleteSpeaker = async (req, res) => {
  try {
    const userType = req.userType;
    if (userType !== "admin") {
      return res
        .status(403)
        .send({ success: false, message: "Not Authorized." });
    }
    const _id = req.params.id;
    // await Event.deleteMany({ hosted_by_user: _id });
    // await Blog.deleteMany({ user_author: _id });
    await Event.updateMany(
      { speakers: _id },
      {
        $pull: { speakers: _id }
      }
    );
    const speaker = await Speaker.findOne({ _id });
    if (!speaker) {
      return res
        .status(404)
        .json({ success: false, message: "Speaker not found." });
    }
    const result = await Speaker.findByIdAndDelete(_id);
    if (!result) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete speaker." });
    }
    return res.status(200).send({ success: true, message: "Speaker Deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
