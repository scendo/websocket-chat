const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/application");

/**
 * Login middleware to handle login api requests
 *
 * Using bcrypt to compare passwords
 *
 * jsonwebtoken to store a logged in user data on the client
 *
 * @param {*} req
 * @param {*} res
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const errorMsg = "The User Email or Password is Incorrect";

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json([{ msg: errorMsg }]);
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (passwordsMatch) {
    // Create JWT Payload
    const payload = { id: user.id, name: user.name };

    // Sign Token
    const token = await jwt.sign(payload, config.SECRET, {
      expiresIn: 3600
    });
    res.json({
      token: "Bearer " + token
    });
  } else {
    return res.status(400).json([{ msg: errorMsg }]);
  }
};
