const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
  name: {
    type: String,
  },
  mobile_no: {
    type: Number,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
  },
});

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
