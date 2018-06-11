const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authController = require("../controllers/auth");

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  router.use(express.static("client/build"));

  router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

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
