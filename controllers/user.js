const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");
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

  res.send("register success!");
};
