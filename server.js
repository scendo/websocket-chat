const mongoose = require("mongoose");

// import environmental variables from our variables.env file
require("dotenv").config({ path: "variables.env" });
const config = require("./config/application");

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on("error", err => {
  console.error(`Mongoose Error: ${err.message}`);
});

require("./models/User");

// Start our app!
const app = require("./app");
app.set("port", config.PORT || 7777);
const server = app.listen(app.get("port"), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
