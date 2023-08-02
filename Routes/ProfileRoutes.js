const { AddUserProfile } = require("../Controller/ProfileController");

const ProfileRoutes = (app) => {
  app.post("/user/addprofile/:id", AddUserProfile);
};

module.exports = ProfileRoutes;
