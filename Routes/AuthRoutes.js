const {
  AdminSignup,
  AdminLogin,
} = require("../Controller/AdminAuthController");
const { UserSignup, UserLogin } = require("../Controller/AuthController");
const {
  UserSendLink,
  resetPassword,
  AdminForgotPassword,
  OtpLogin,
  adminResetPassword,
} = require("../Controller/forgetpassController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

const AuthRoutes = (app) => {
  app.post("/user/signup", UserSignup);
  app.post("/user/login", UserLogin);
  app.post("/user/forgotPassword", UserSendLink);
  app.post(
    "/user/reset-password/:_id/:resetToken/:expirationTime",
    resetPassword
  );
  // app.post("/admin/signup", AdminSignup);
  // app.post("/admin/login", AdminLogin);
  // app.post("/admin/forgotpassword", AdminForgotPassword);
  // app.post("/admin/templogin", OtpLogin);
  // app.post("/admin/resetPassword", AuthMiddleware, adminResetPassword);
};

module.exports = AuthRoutes;
