const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");
const bcrypt = require("bcrypt");
const { check, body, validationResult } = require("express-validator/check");

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
    res.status("500").json(errors);
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
    errors.email = "Email already exists";
    return res.status(400).json(errors);
  }

  //salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hash
  });

  if (newUser) {
    res.json({ success: true });
  }
  res.status(500);
};
