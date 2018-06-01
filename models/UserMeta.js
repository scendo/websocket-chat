const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const userMetaSchema = new Schema({
  userId: {
    type: String,
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

module.exports = mongoose.model("UserMeta", userMetaSchema);
