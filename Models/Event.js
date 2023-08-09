const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
    event_name: {
        type:String,
    },
    event_description: {
        type:String,
    },
    language: {
        tpe:String,
    },
    event_poster: {
        type:String,
    },
    event_date: {
        type:Date,
    },
}); 


const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
