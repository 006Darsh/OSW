const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
  event_name: {
    type: String,
  },
  event_description: {
    type: String,
  },
  language: {
    type: String,
  },
  event_poster: {
    type: String,
  },
  event_date: {
    type: Date,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  happened: {
    type: Boolean,
    default: false,
  },
});

EventSchema.methods.checkEventStatus = function () {
  const currentDate = new Date();
  if (this.event_date <= currentDate || this.endTime <= currentDate) {
    this.happened = true;
  }
};

EventSchema.pre("save", function (next) {
  this.checkEventStatus();
  next();
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
