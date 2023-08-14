const {
  CreateEvent,
  GetEvents,
  GetPersonalEvents,
  GetEventById,
  UpdateEvent,
  DeleteEvent,
} = require("../Controller/EventController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");
const fileUploaderMiddleware = require("../Middlewares/fileUploaderMiddleware");
const eventmediaUploaderMiddleware = fileUploaderMiddleware("event");

const BLogRoutes = (app) => {
  // media routes : auth required
  app.get("/events", AuthMiddleware, GetEvents);
  app.get("/personal-events", AuthMiddleware, GetPersonalEvents);
  app.get("/event/:id", AuthMiddleware, GetEventById);
  app.post(
    "/event/create-event",
    AuthMiddleware,
    // eventmediaUploaderMiddleware,
    CreateEvent
  );
  app.put("/event/update-event/:id", AuthMiddleware, UpdateEvent);
  app.delete("/event/delete-event/:id", AuthMiddleware, DeleteEvent);

  // Helper route for uploading images for media posts
  //   app.post(
  //     "/blog/upload",
  //     AuthMiddleware,
  //     blogmediaUploaderMiddleware,
  //     uploadFile
  //   );
};

module.exports = BLogRoutes;
