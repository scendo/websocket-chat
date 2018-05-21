const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authController = require("../controllers/auth");

router.get("/", (req, res) => {
  res.send("Hello From Chat App");
});

/**
 * API
 */
router.post(
  "/api/v1/register",
  userController.validateRegister,
  userController.register
);

router.post("/api/v1/login", authController.login);

module.exports = router;
