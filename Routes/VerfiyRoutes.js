// const { UserSignup, UserLogin } = require("../Controller/AuthController");

const { UserSendOtp, UserVerification } = require("../Controller/VerficationController");


const VerifyRoutes = (app) => {
  app.post("/email/sendotp", UserSendOtp);
  app.post("/email/verify", UserVerification);
};

module.exports = VerifyRoutes;
