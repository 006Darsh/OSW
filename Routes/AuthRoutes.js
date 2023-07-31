const { UserSignup,UserLogin } = require("../Controller/AuthController");
const { UserSendLink, resetPassword } = require("../Controller/forgetpassController");

const AuthRoutes = (app) => {
  app.post("/user/signup", UserSignup);
  app.post("/user/login", UserLogin);
  app.post("/user/forgotPassword", UserSendLink);
  app.post(
    "/user/reset-password/:_id/:resetToken/:expirationTime",
    resetPassword
  );
};

module.exports = AuthRoutes;
