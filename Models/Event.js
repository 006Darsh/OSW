const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({});
const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
