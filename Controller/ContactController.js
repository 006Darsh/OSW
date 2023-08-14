const Contact = require("../Models/ContactUs");

exports.ContactUs = async (req, res) => {
  try {
    const { name, mobile_no, email, message } = req.body;
    if (!name || !mobile_no || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All details are required to add a team member !!!",
      });
    }
    const newMessage = new Contact({
      name,
      mobile_no,
      email,
      message,
    });
    await newMessage.save();
    return res.status(200).send({
      success: true,
      team_member: newMessage,
      message: "Team Member Added Successfully",
    });
  } catch (error) {
    console.error("Error in sending message:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while contacting us.",
    });
  }
};
