const {
  AddUserProfile,
  getUserProfile,
  uploadProfilePic,
  getProfilePic,
} = require("../Controller/ProfileController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");
const fileUploaderMiddleware = require("../Middlewares/fileUploaderMiddleware");
const picUploaderMiddleware = fileUploaderMiddleware("Pic");

const ProfileRoutes = (app) => {
  app.post("/user/addprofile", AuthMiddleware, AddUserProfile);
  app.get("/user/profile/:id", getUserProfile);
  app.post(
    "/user/upload-pic/:id",
    AuthMiddleware,
    picUploaderMiddleware,
    uploadProfilePic
  );
  app.get("/user/profile-pic/:id", getProfilePic);
};

module.exports = ProfileRoutes;
