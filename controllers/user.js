const mongoose = require("mongoose");
const User = mongoose.model("User");
const UserMeta = mongoose.model("UserMeta");
const Room = mongoose.model("Room");
const promisify = require("es6-promisify");
const bcrypt = require("bcrypt");
const { check, body, validationResult } = require("express-validator/check");
const { getRandomColor } = require("../utils/chat");
/**
 * Validate registration fields sent through the request
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.validateRegister = (req, res, next) => {
  console.log(req.body);
  req.sanitizeBody("name");
  req
    .checkBody("name", "You must supply a name!")
    .not()
    .isEmpty();
  req.checkBody("email", "That email is not valid!").isEmail();

  /**
   * Sanitize and normalized the email parameter
   *
   * Uses validator
   *
   * @link https://www.npmjs.com/package/validator
   */
  req.checkBody("email").normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req
    .checkBody("password", "Password Cannot be Blank!")
    .not()
    .isEmpty();
  req
    .checkBody("passwordconfirm", "Confirm password Cannot be Blank!")
    .not()
    .isEmpty();
  req
    .checkBody("passwordconfirm", "Oops! Your passwords do not match")
    .equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    res.status(400).json(errors);
    return;
  }
  next();
};

/**
 * Register/Create a new user
 *
 * Creates a new user if user does not exist.
 * Salts and hashes the password before inserting model
 *
 * @param {*} req
 * @param {*} res
 */
exports.register = async (req, res) => {
  const errors = {};
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).json([{ msg: "Please try again" }]);
  }

  //salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  const defaultRoom = await Room.findOne({
    name: "Community",
    group: "channel"
  });

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    rooms: [defaultRoom]
  });

  //Default userMeta
  const userMetaPromise = UserMeta.create([
    { userId: newUser._id, key: "badgeColor", value: getRandomColor() },
    { userId: newUser._id, key: "totalUnreadMessages", value: 0 }
  ]);

  const result = await Promise.all([newUser.save(), userMetaPromise]);

  if (result) {
    res.json({ success: true });
  }
  res.status(500);
};
