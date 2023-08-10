const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  event_name: {
    type: String,
  },
  event_description: {
    type: String,
  },
  language: {
    tpe: String,
  },
  event_poster: {
    type: String,
  },
  event_date: {
    type: Date,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  timeZone: {
    type: String,
    default: "UTC",
  },
  event_type: {
    type: String,
    enum: ["Online", "Offline"],
    required: true,
  },
  meet_link: {
    type: String,
    required: function () {
      return this.event_type === "Online";
    },
  },
  location: {
    address: String,
    state: String,
    country: String,
    city: String,
  },
  expected_no_of_attendee: {
    type: Number,
  },
  socialmedia_links: [
    {
      type: String,
    },
  ],
  event_goals: {
    type: String,
  },
  event_tags: [
    {
      type: String,
    },
  ],
  hosted_by_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  hosted_by_admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
