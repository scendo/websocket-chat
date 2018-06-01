const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  registered: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Invalid Email Address"],
    required: "Please Supply an email address"
  },
  name: {
    type: String,
    required: "Please supply a name",
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  rooms: {
    type: Array,
    trim: true
  },
  metaData: {
    type: Object,
    trim: true
  },
  socketId: {
    type: String,
    trim: true
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongodbErrorHandler);

userSchema.set("toJSON", {
  virtuals: true
});

/**
 * Update a user's socketId field
 *
 * @returns {Promise} Promise object resulting in the updated User
 */
userSchema.statics.updateUserSocketId = function(userId, socketId) {
  return this.findByIdAndUpdate(
    userId,
    { socketId },
    {
      select: {
        rooms: 1,
        name: 1,
        socketId: 1,
        metaData: 1
      },
      new: true
    }
  );
};

/**
 * Remove a user's socketId field
 *
 * @param {*} socketId
 * @returns {Promise} Promise object resulting in the updated User
 */
userSchema.statics.removeUserSocketId = function(socketId) {
  return this.findOneAndUpdate(
    { socketId },
    { $unset: { socketId: "" } },
    { new: true }
  );
};

/**
 * Get all of the users and limits the fields only to what is necessary
 *
 * Fields:
 *
 * rooms
 * name
 * socketId
 * metaData
 *
 * @returns {Promise} Promise object resulting in an array of Users
 */
userSchema.statics.getAllUsers = function() {
  return this.find(
    {},
    {
      rooms: 1,
      name: 1,
      socketId: 1,
      metaData: 1
    }
  );
};

/**
 * Add a room to the user
 *
 * ie: a user "joins" a room
 *
 * @param {*} userId
 * @param {*} roomId
 * @returns {Promise} Promise object
 */
userSchema.statics.joinRoom = function(userId, roomId) {
  return this.findByIdAndUpdate(userId, { $addToSet: { rooms: roomId } });
};

module.exports = mongoose.model("User", userSchema);
