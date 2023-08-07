const {
  AddSpeakers,
  getallSpeakers,
} = require("../Controller/SpeakerController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

const SpeakerRoutes = (app) => {
  app.post("/admin/add-speaker", AuthMiddleware, AddSpeakers);
  app.get("/all-speaker", getallSpeakers);
};

module.exports = SpeakerRoutes;
