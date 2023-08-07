const {
  AddTeamMember,
  getallTeamMembers,
} = require("../Controller/TeamController");

const AuthMiddleware = require("../Middlewares/AuthMiddleware");

const AdminRoutes = (app) => {
  app.post("/admin/add-teammember", AuthMiddleware, AddTeamMember);
  app.get("/all-team-members", getallTeamMembers);
};

module.exports = AdminRoutes;
