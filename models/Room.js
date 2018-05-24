const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const roomSchema = new Schema(
  {
    created: {
      type: Date,
      default: Date.now
    },
    name: {
      type: String,
      required: "Please supply a name",
      trim: true
    },
    group: {
      type: String
    },
    activeUsers: {
      type: Array,
      trim: true
    },
    users: {
      type: Array,
      trim: true
    },
    messages: {
      type: Array,
      trim: true
    }
  },
  {
    toJSON: { virtuals: true }
  }
);

roomSchema.plugin(mongodbErrorHandler);

// Ensure virtual fields are serialised.
roomSchema.set("toJSON", {
  virtuals: true
});

module.exports = mongoose.model("Room", roomSchema);
