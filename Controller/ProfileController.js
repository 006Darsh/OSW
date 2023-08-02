const User = require("../Models/Users");

exports.AddUserProfile = async (req, res) => {
  try {
    const UserId = req.params.id;
    const { user_name, first_name, last_name } = req.body;
    let updatedFields = {
      user_name,
      "profile.first_name": first_name,
      "profile.last_name": last_name,
    };
    const user = await User.findByIdAndUpdate(
      UserId,
      { $set: updatedFields },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
