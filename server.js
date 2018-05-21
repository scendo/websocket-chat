// import environmental variables from our variables.env file
require("dotenv").config({ path: "variables.env" });
const config = require("./config/application");

// Start our app!
const app = require("./app");
app.set("port", config.PORT || 7777);
const server = app.listen(app.get("port"), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
