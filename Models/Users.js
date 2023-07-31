const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    rewuired: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Number,
  },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
