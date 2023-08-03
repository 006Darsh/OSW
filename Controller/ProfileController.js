const User = require("../Models/Users");

exports.AddUserProfile = async (req, res) => {
  try {
    const UserId = req.user._id;
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

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const responseData = {
      user_name: user.user_name,
      email: user.email,
      profile: {
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
      },
      is_verified: user.verified,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.uploadProfilePic = async (req, res) => {
  // console.log(req.userType);
  // if (req.userType !== "company") {
  //   return res.status(401).json({ success: false, message: "Not Authorized." });
  // }

  if (!req.fileUrl) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const fileUrl = req.fileUrl;

  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the user already has an existing logo
    if (user.profile.profile_pic) {
      // Delete the old logo file

      const oldLogoPath = user.profile.profile_pic;
      const filePath = oldLogoPath.replace("http://localhost:4000", "");
      // Construct the full file path on the server
      const fullPath = `D:\\OSW${filePath}`;

      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    // Update the logo path in the user's profile
    user.profile.profile_pic = fileUrl;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User Profile pic uploaded successfully",
      LogoURL: fileUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile pic",
      error: error.message,
    });
  }
};

exports.getProfilePic = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne(
      { _id: id },
      {
        "profile.profile_pic": 1,
      }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const PicPath = user.profile.profile_pic;
    if (!PicPath) {
      return res.status(404).json({
        success: false,
        message: "Profile pic not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile pic found.",
      LogoURL: PicPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
