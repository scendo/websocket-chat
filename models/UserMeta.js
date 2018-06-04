const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const userMetaSchema = new Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: "Please supply a user id"
  },
  key: {
    type: String,
    trim: true,
    required: "Please supply a meta key"
  },
  value: {
    type: Schema.Types.Mixed,
    trim: true,
    required: "Please supply a meta value"
  }
});

userMetaSchema.plugin(mongodbErrorHandler);

userMetaSchema.set("toJSON", {
  virtuals: true
});

/**
 * Gets all of the UserMeta for a given user
 *
 * @param {number} userId
 * @returns {Promise} Promise object resulting in an array of UserMeta
 */
userMetaSchema.statics.getAllUserMeta = function(userId) {
  return this.find(
    { userId },
    {
      key: 1,
      value: 1
    }
  );
};

/**
 * Increments the unreadMessageCount UserMeta field for a given roomId
 *
 * @param {*} userId
 * @param {*} roomId
 * @returns {Promise} Promise object resulting in an array of UserMeta
 */
userMetaSchema.statics.incrementUnreadMessages = function(userId, roomId) {
  return this.findOneAndUpdate(
    {
      userId,
      key: `room_${roomId}`
    },
    { $inc: { "value.unreadMessageCount": 1 } }
  );
};

/**
 * Set the unreadMessageCount UserMeta field for a given roomId to a count/value
 *
 * @param {*} userId
 * @param {*} roomId
 * @param {*} count
 * @returns {Promise} Promise object
 */
userMetaSchema.statics.setUnreadMessages = function(userId, roomId, count) {
  return this.findOneAndUpdate(
    {
      userId,
      key: `room_${roomId}`
    },
    { $set: { "value.unreadMessageCount": count } }
  );
};

module.exports = mongoose.model("UserMeta", userMetaSchema);
