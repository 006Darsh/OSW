const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema({
  name: {
    type: String,
  },
  bio: {
    type: String,
  },
  post: {
    type: String,
  },
  social_links: [
    {
      type: String,
    },
  ],
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});
const Team = mongoose.model("Team", TeamSchema);
module.exports = Team;

