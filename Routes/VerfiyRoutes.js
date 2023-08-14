// const { UserSignup, UserLogin } = require("../Controller/AuthController");

const { UserSendOtp, UserVerification } = require("../Controller/VerficationController");


const VerifyRoutes = (app) => {
  app.post("user/email-verification/sendotp", UserSendOtp);
  app.post("user/email-verification/verify", UserVerification);
};

module.exports = VerifyRoutes;
