const { UserSignup,UserLogin } = require("../Controller/AuthController");

const AuthRoutes = (app) => {
  app.post("/user/signup", UserSignup);
  app.post("/user/login", UserLogin);
};

module.exports = AuthRoutes;
