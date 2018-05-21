const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

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

router.post("/api/v1/login", (req, res) => {
  res.send("Logging user in...");
});

module.exports = router;
