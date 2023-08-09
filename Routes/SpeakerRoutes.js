const {
  AddSpeakers,
  getallSpeakers,
  getspeakerDetails,
} = require("../Controller/SpeakerController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");
const fileUploaderMiddleware = require("../Middlewares/fileUploaderMiddleware");
const picUploaderMiddleware = fileUploaderMiddleware("speaker");
const SpeakerRoutes = (app) => {
  app.post(
    "/admin/add-speaker",
    AuthMiddleware,
    picUploaderMiddleware,
    AddSpeakers
  );
  app.get("/speaker/all-details/:id", getspeakerDetails);
  app.get("/all-speaker", getallSpeakers);
};

module.exports = SpeakerRoutes;
