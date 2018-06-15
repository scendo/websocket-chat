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
 * Get a userMeta value by given a userId and key
 *
 * @param {*} userId
 * @param {*} key
 */
userMetaSchema.statics.get = async function(userId, key) {
  const userMeta = await this.findOne(
    {
      userId,
      key
    },
    {
      _id: false,
      value: true
    },
    {}
  );

  return userMeta.value;
};

/**
 * Get a roomMeta value in UserMeta given a roomMetaKey
 *
 * @param {*} userId
 * @param {*} roomId
 * @param {*} key
 */
userMetaSchema.statics.getRoomMeta = async function(
  userId,
  roomId,
  roomMetaKey
) {
  const roomMeta = await this.findOne(
    {
      userId,
      key: `room_${roomId}`
    },
    {
      _id: false,
      value: true
    },
    {}
  );

  return roomMeta.value[roomMetaKey] !== undefined
    ? roomMeta.value[roomMetaKey]
    : false;
};

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
userMetaSchema.statics.incUnreadMsgCount = function(userId, roomId) {
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

/**
 * Increments the totalUnreadMessages UserMeta field for a given userId
 *
 * @param {*} userId
 */
userMetaSchema.statics.incTotalUnreadMsgs = function(userId) {
  console.log("INCREMENT TOTAL UNREAD");
  return this.findOneAndUpdate(
    {
      userId,
      key: "totalUnreadMessages"
    },
    { $inc: { value: 1 } }
  );
};

/**
 * Resets totalUnreadMessages back to 0
 *
 * @param {*} userId
 */
userMetaSchema.statics.setTotalUnreadMsgs = function(userId, count) {
  return this.findOneAndUpdate(
    {
      userId,
      key: "totalUnreadMessages"
    },
    { $set: { value: count } }
  );
};

module.exports = mongoose.model("UserMeta", userMetaSchema);
