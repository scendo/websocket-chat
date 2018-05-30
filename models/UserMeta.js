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

module.exports = mongoose.model("UserMeta", userMetaSchema);
