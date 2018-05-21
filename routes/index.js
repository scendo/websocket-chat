const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/", (req, res) => {
  res.send("Hello From Chat App");
});

/**
 * API
 */
router.post("/api/v1/register", userController.validateRegister);

module.exports = router;
