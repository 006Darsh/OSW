const cron = require("node-cron");
const Event = require("../Models/Event");
const Speaker = require("../Models/Speaker");
const {
  NotifyUsersEvent,
  AttendeeIncreaseNotification,
} = require("./NotificationController");

exports.CreateEvent = async (req, res) => {
  try {
    const user = req.user;
    const {
      event_name,
      event_description,
      language,
      event_date,
      startTime,
      endTime,
      timeZone,
      event_type,
      meet_link,
      location,
      limit,
      socialmedia_links,
      event_goals,
      event_tags,
      speaker,
    } = req.body;
    const fileUrl = req.fileUrl;
    if (req.userType === "user") {
      const newEvent = new Event({
        event_name,
        event_description,
        language,
        event_date,
        startTime,
        endTime,
        timeZone,
        event_type,
        event_poster: fileUrl,
        meet_link,
        location,
        limit,
        socialmedia_links,
        event_goals,
        event_tags,
        hosted_by_user: user._id,
        speaker,
      });
      const createdEvent = await newEvent.save();
      if (createdEvent) {
        const title = "New event Available";
        const content = `A new ${
          newEvent.event_type
        } event is available.\nEvent Name is : ${
          newEvent.event_name
        }.\nTags of event are ${newEvent.event_tags.join(", ")}`;
        NotifyUsersEvent(newEvent, content, title);
        return res.status(200).json({
          success: true,
          Event: createdEvent,
        });
      }
    }

    const newEvent = new Event({
      event_name,
      event_description,
      language,
      event_date,
      startTime,
      endTime,
      timeZone,
      event_type,
      event_poster: fileUrl,
      meet_link,
      location,
      limit,
      socialmedia_links,
      event_goals,
      event_tags,
      hosted_by_admin: user._id,
      speaker,
    });
    const createdEvent = await newEvent.save();

    for (const s of speaker) {
      try {
        console.log(s);
        const speakerId = s;
        const updatedSpeaker = await Speaker.findOneAndUpdate(
          { _id: speakerId },
          { $push: { sessions: createdEvent._id } }
        );

        if (!updatedSpeaker) {
          console.error(`Speaker with ID ${speakerId} not found.`);
        }
      } catch (error) {
        console.error(`Error updating speaker: ${error}`);
      }
    }
    if (createdEvent) {
      const title = "New event Available";
      const content = `A new ${
        newEvent.event_type
      } event is available.\nEvent Name is : ${
        newEvent.event_name
      }.\nTags of event are ${newEvent.event_tags.join(", ")}`;
      NotifyUsersEvent(newEvent, content, title);
      return res.status(200).json({
        success: true,
        Event: createdEvent,
      });
    }
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
    events = await Event.find(
      {},
      "_id event_name event_date event_type"
    ).populate({
      path: "hosted_by_user",
      select: "profile.first_name profile.last_name profile.profile_pic",
    });

    if (!events) {
      return res
        .status(404)
        .json({ success: false, message: "No events found !!" });
    }

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
      } else {
        eventData.hosted_by_admin = "admin";
      }
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
    // if (req.userType === "user") {
    event = await Event.findById(eventId).populate({
      path: "hosted_by_user",
      select: "profile.first_name profile.last_name profile.profile_pic",
    });
    // } else {
    //   event = await Event.findById(eventId).populate({
    //     path: "hosted_by_admin",
    //   });
    // }

    if (!event) {
      console.warn("here");
      return res
        .status(404)
        .json({ success: false, message: "Event not found !!" });
    }

    if (event.hosted_by_user) {
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
      event_date,
      startTime,
      endTime,
      timeZone,
      event_type,
      meet_link,
      location,
      limit,
      socialmedia_links,
      event_goals,
      event_tags,
    } = req.body;
    const fileUrl = req.fileUrl;
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
      return res.status(404).json({
        success: false,
        message:
          "Event can not edited now as today/tommorow is the event or event has been already occured.",
      });
    }
    let content = `The ${event.event_type} event "${event.event_name}" has been updated. Changes include:\n`;
    if (event_name !== event.event_name) {
      content += `- Event Name: ${event.event_name} -> ${event_name}\n`;
      event.event_name = event_name;
    }
    if (event_description !== event.event_description) {
      content += `- Event Description: ${event.event_description} -> ${event_description}\n`;
      event.event_description = event_description;
    }
    if (language !== event.language) {
      content += `- Language: ${event.language} -> ${language}\n`;
      event.language = language;
    }
    if (fileUrl !== event.event_poster) {
      content += `- Event Poster: ${event.event_poster} -> ${fileUrl}\n`;
      event.event_poster = fileUrl;
    }
    if (event_date !== event.event_date) {
      content += `- Event Date: ${event.event_date} -> ${event_date}\n`;
      event.event_date = event_date;
    }
    if (startTime !== event.startTime) {
      content += `- Start Time: ${event.startTime} -> ${startTime}\n`;
      event.startTime = startTime;
    }
    if (endTime !== event.endTime) {
      content += `- End Time: ${event.endTime} -> ${endTime}\n`;
      event.endTime = endTime;
    }
    if (timeZone !== event.timeZone) {
      content += `- Time Zone: ${event.timeZone} -> ${timeZone}\n`;
      event.timeZone = timeZone;
    }
    if (event_type !== event.event_type) {
      content += `- Event Type: ${event.event_type} -> ${event_type}\n`;
      event.event_type = event_type;
    }
    if (meet_link !== event.meet_link) {
      content += `- Meet Link: ${event.meet_link} -> ${meet_link}\n`;
      event.meet_link = meet_link;
      event.location = {};
    }
    if (location !== event.location) {
      content += `- Location: ${JSON.stringify(
        event.location
      )} -> ${JSON.stringify(location)}\n`;
      event.location = location;
      event.meet_link = "";
    }
    if (limit !== event.limit) {
      content += `- Expected No. of Attendees: ${event.limit} -> ${limit}\n`;
      event.limit = limit;
    }
    if (socialmedia_links !== event.socialmedia_links) {
      content += `- Social Media Links: ${JSON.stringify(
        event.socialmedia_links
      )} -> ${JSON.stringify(socialmedia_links)}\n`;
      event.socialmedia_links = socialmedia_links;
    }
    if (event_goals !== event.event_goals) {
      content += `- Event Goals: ${event.event_goals} -> ${event_goals}\n`;
      event.event_goals = event_goals;
    }
    if (event_tags !== event.event_tags) {
      content += `- Event Tags: ${JSON.stringify(
        event.event_tags
      )} -> ${JSON.stringify(event_tags)}\n`;
      event.event_tags = event_tags;
    }

    event.updatedAt = Date.now();

    const updatedEvent = await event.save();
    if (updatedEvent) {
      const title = "An event is updated";
      content += "\nCheck it out now!";
      NotifyUsersEvent(updatedEvent, content, title);
    }
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
    await Speaker.updateMany(
      { sessions: eventId },
      { $pull: { sessions: eventId } }
    );
    if (deletedEvent) {
      const title = "An event is deleted";
      let content = `The event ${deletedEvent.event_name} has been deleted by the admin because of the community guidelines and our policies`;
      NotifyUsersEvent(deletedEvent, content, title);
    }
    return res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", err });
  }
};

exports.AttendEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.eventid;
    console.log(userId);
    const event = await Event.findById(eventId);
    if (!event.happened || event.total_attendees !== event.limit) {
      if (
        !event.attendees.includes(userId) &&
        event.hosted_by_user !== userId
      ) {
        const event = await Event.findOneAndUpdate(
          { _id: eventId },
          { $push: { attendees: userId } },
          { new: true } // Returns the updated document
        );

        if (event) {
          const newTotalAttendees = event.attendees.length;
          event.total_attendees = newTotalAttendees;
          if (
            event.total_attendees / 20 !== event.attendees_check / 20 ||
            event.total_attendees === event.limit
          ) {
            event.attendees_check = event.total_attendees;
            AttendeeIncreaseNotification(event.total_attendees, event);
          }
          await event.save();
        }
        return res.status(200).json({
          success: true,
          message: "You have successfully registered for the event.",
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "You are already attending this event.",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: `Sorry, registrations for the event are closed. Please stay tuned!`,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};

// Function to check and update event status
const checkEventStatus = async () => {
  try {
    const currentDate = new Date();

    // Find events where event_date or endTime is in the past
    const eventsToUpdate = await Event.find({
      $or: [
        { event_date: { $lte: currentDate } }, // Event date is in the past
        { endTime: { $lte: currentDate } }, // Event end time is in the past
        { event_date: { $gte: currentDate, $lte: currentDate + 1 } }, // Event date is today or tomorrow
      ],
      happened: false, // Only update events that haven't happened yet
    });

    // Update the happened status for each event
    for (const event of eventsToUpdate) {
      event.happened = true;
      await event.save();
    }

    console.log("Updated event statuses.");
  } catch (error) {
    console.error("Error updating event statuses:", error);
  }
};
cron.schedule("0 0 * * *", () => {
  console.log("Running checkEventStatus function...");
  checkEventStatus();
});
