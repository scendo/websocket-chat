const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req, res) => {
  res.send("Hello From Chat App");
});

/**
 * API
 */
router.post("/api/v1/register", (req, res) => {
  res.send("register user!");
});

module.exports = router;
