// const { UserSignup, UserLogin } = require("../Controller/AuthController");

const { UserSendOtp, UserVerification } = require("../Controller/VerficationController");


const VerifyRoutes = (app) => {
  app.post("/email-verification/sendotp", UserSendOtp);
  app.post("/email-verification/verify", UserVerification);
};

module.exports = VerifyRoutes;
