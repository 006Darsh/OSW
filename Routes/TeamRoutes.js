const {
  AddTeamMember,
  getallTeamMembers,
  getmemberDetails,
} = require("../Controller/TeamController");

const AuthMiddleware = require("../Middlewares/AuthMiddleware");
const fileUploaderMiddleware = require("../Middlewares/fileUploaderMiddleware");
const picUploaderMiddleware = fileUploaderMiddleware("team");

const AdminRoutes = (app) => {
  app.post(
    "/admin/add-teammember",
    AuthMiddleware,
    picUploaderMiddleware,
    AddTeamMember
  );
  // app.get("/user/profile-pic/:id",);
  app.get("/team-member/all-details/:id", getmemberDetails);
  app.get("/all-team-members", getallTeamMembers);
};

module.exports = AdminRoutes;
