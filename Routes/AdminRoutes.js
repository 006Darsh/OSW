const {
  AdminSignup,
  AdminLogin,
} = require("../Controller/AdminAuthController");
const { AddTeamMember } = require("../Controller/TeamController");
const {
  AdminForgotPassword,
  OtpLogin,
  adminResetPassword,
} = require("../Controller/forgetpassController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

const AdminRoutes = (app) => {
  app.post("/admin/signup", AdminSignup);
  app.post("/admin/login", AdminLogin);
  app.post("/admin/forgotpassword", AdminForgotPassword);
  app.post("/admin/templogin", OtpLogin);
  app.post("/admin/resetPassword", AuthMiddleware, adminResetPassword);
};

module.exports = AdminRoutes;
