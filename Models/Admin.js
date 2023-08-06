const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Number,
  },
  resetTokenUsed: {
    type: Boolean,
  },
});
const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;