const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: String,
  type: String,
  date: String,
  location: String,
  hostedBy: String,
  registeredUsers: [String] // email IDs
});

module.exports = mongoose.model('Event', EventSchema);
