const Event = require("../Models/Event");

exports.CreateEvent = async (req, res) => {
  try {
    const user = req.user;
    const {
      event_name,
      event_description,
      language,
      event_poster,
      event_date,
      startTime,
      endTime,
      timeZone,
      event_type,
      meet_link,
      location,
      expected_no_of_attendee,
      socialmedia_links,
      event_goals,
      event_tags,
    } = req.body;
    if (req.userType === "user") {
      const newEvent = new Event({
        event_name,
        event_description,
        language,
        event_poster,
        event_date,
        startTime,
        endTime,
        timeZone,
        event_type,
        meet_link,
        location,
        expected_no_of_attendee,
        socialmedia_links,
        event_goals,
        event_tags,
        hosted_by_user: user._id,
      });
      const createdEvent = await newEvent.save();
      return res.status(200).json(createdEvent);
    }
    const newEvent = new Event({
      event_name,
      event_description,
      language,
      event_poster,
      event_date,
      startTime,
      endTime,
      timeZone,
      event_type,
      meet_link,
      location,
      expected_no_of_attendee,
      socialmedia_links,
      event_goals,
      event_tags,
      hosted_by_admin: user._id,
    });
    const createdEvent = await newEvent.save();
    return res.status(200).json(createdEvent);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.GetEvents = async (req, res) => {
  try {
    let events;
    if (req.userType === "user") {
      events = await Event.find().populate({
        path: "hosted_by_user",
        select: "profile.first_name profile.last_name profile.profile_pic",
      });
    } else {
      events = await Event.find().populate({
        path: "hosted_by_admin",
      });
    }

    if (!events) {
      return res
        .status(404)
        .json({ success: false, message: "No events found !!" });
    }

    // console.log(events[0].author);
    if (req.userType === "user") {
      const eventsData = events.map((event) => {
        const eventData = {
          ...event._doc,
        };

        if (event.hosted_by_user) {
          eventData.hosted_by_user =
            event.hosted_by_user.profile.first_name +
            " " +
            event.hosted_by_user.profile.last_name;
          eventData.profile_pic = event.hosted_by_user.profile.profile_pic;
        }
        return eventData;
      });
      return res.status(200).json({ success: true, eventsData });
    }
    const eventsData = events.map((event) => {
      const eventData = {
        ...event._doc,
      };
      eventData.hosted_by_admin = "admin";
      return eventData;
    });
    console.log(eventsData);
    return res.status(200).json({ success: true, eventsData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.GetPersonalEvents = async (req, res) => {
  try {
    let events;
    if (req.userType === "user") {
      events = await Event.find({ hosted_by_user: req.user._id }).populate({
        path: "hosted_by_user",
        select: "profile.first_name profile.last_name profile.profile_pic",
      });
    } else {
      events = await Event.find({ hosted_by_admin: req.user._id }).populate({
        path: "hosted_by_admin",
      });
    }

    if (!events) {
      return res
        .status(404)
        .json({ success: false, message: "No events found !!" });
    }

    // console.log(events[0].author);
    if (req.userType === "user") {
      const eventsData = events.map((event) => {
        const eventData = {
          ...event._doc,
        };

        if (event.hosted_by_user) {
          eventData.hosted_by_user =
            event.hosted_by_user.profile.first_name +
            " " +
            event.hosted_by_user.profile.last_name;
          eventData.profile_pic = event.hosted_by_user.profile.profile_pic;
        }
        return eventData;
      });
      return res.status(200).json({ success: true, eventsData });
    }
    const eventsData = events.map((event) => {
      const eventData = {
        ...event._doc,
      };
      eventData.hosted_by_admin = "admin";
      return eventData;
    });
    console.log(eventsData);
    return res.status(200).json({ success: true, eventsData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.GetEventById = async (req, res) => {
  const eventId = req.params.id;

  try {
    let event;
    if (req.userType === "user") {
      event = await Event.findById(eventId).populate({
        path: "hosted_by_user",
        select: "profile.first_name profile.last_name profile.profile_pic",
      });
    } else {
      event = await Event.findById(eventId).populate({
        path: "hosted_by_admin",
      });
    }

    if (!event) {
      console.warn("here");
      return res
        .status(404)
        .json({ success: false, message: "Event not found !!" });
    }

    if (req.userType === "user") {
      const eventData = {
        ...event._doc,
        hosted_by_user:
          event.hosted_by_user.profile.first_name +
          " " +
          event.hosted_by_user.profile.last_name,
        profile_pic: event.hosted_by_user.profile.profile_pic,
      };
      res.status(200).json({ success: true, eventData });
    } else {
      const eventData = {
        ...event._doc,
        hosted_by_admin: "admin",
      };
      res.status(200).json({ success: true, eventData });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.UpdateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    // const { title, content, blogUrl } = req.body;
    const {
      event_name,
      event_description,
      language,
      event_poster,
      event_date,
      startTime,
      endTime,
      timeZone,
      event_type,
      meet_link,
      location,
      expected_no_of_attendee,
      socialmedia_links,
      event_goals,
      event_tags,
    } = req.body;
    // if (!title || !content) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Title and content is require to create a blog !!!",
    //   });
    // }
    let event;
    if (req.userType === "user") {
      event = await Event.findById(eventId).populate(
        "hosted_by_user",
        "profile.first_name" + "profile.last_name"
      );
    } else {
      event = await Event.findById(eventId).populate("hosted_by_admin");
    }

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event Not Found." });
    }
    if (event.happened) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Event can not edited now as today is the event or event has been already occured.",
        });
    }
    if (event_name) {
      event.event_name = event_name;
    }
    if (event_description) {
      event.event_description = event_description;
    }
    if (language) {
      event.language = language;
    }
    if (event_poster) {
      event.event_poster = event_poster;
    }
    if (event_date) {
      event.event_date = event_date;
    }
    if (startTime) {
      event.startTime = startTime;
    }
    if (endTime) {
      event.endTime = endTime;
    }
    if (timeZone) {
      event.timeZone = timeZone;
    }
    if (event_type) {
      event.event_type = event_type;
    }
    if (meet_link) {
      event.meet_link = meet_link;
      event.location = {};
    }
    if (location) {
      event.location = location;
      event.meet_link = "";
    }
    if (expected_no_of_attendee) {
      event.expected_no_of_attendee = expected_no_of_attendee;
    }
    if (socialmedia_links) {
      event.socialmedia_links = socialmedia_links;
    }
    if (event_goals) {
      event.event_goals = event_goals;
    }
    if (event_tags) {
      event.event_tags = event_tags;
    }
    event.updatedAt = Date.now();

    const updatedEvent = await event.save();
    if (req.userType === "user") {
      const eventData = {
        ...updatedEvent._doc,
        hosted_by_user:
          updatedEvent.hosted_by_user.profile.first_name +
          updatedEvent.hosted_by_user.profile.last_name,
      };
      return res.status(200).json({ success: true, eventData });
    }
    const eventData = {
      ...updatedEvent._doc,
      hosted_by_admin: "Admin",
    };
    return res.status(200).json({ success: true, eventData });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.DeleteEvent = async (req, res) => {
  if (req.userType !== "admin") {
    return res.status(401).send({ success: false, message: "Not Authorized." });
  }
  try {
    const eventId = req.params.id;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res
        .status(400)
        .json({ success: false, message: "Event not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
