const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const messageSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    trim: true,
    required: "Please supply a user for the message"
  },
  roomId: {
    type: String,
    trim: true,
    required: "Please Supply a room id for the message"
  },
  value: {
    type: String,
    required: "Please supply a message value",
    trim: true
  }
});

// Ensure virtual fields are serialised.
messageSchema.set("toJSON", {
  virtuals: true
});

messageSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("Message", messageSchema);
