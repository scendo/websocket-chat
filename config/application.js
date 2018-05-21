let envVars;

//Import environment specific variables
switch (process.env.NODE_ENV) {
  case "development":
    envVars = require("./environments/development");
  case "staging":
    envVars = require("./environments/staging");
  case "production":
    envVars = require("./environments/production");
}
/**
 * General Application config variables
 */
const applicationVars = {};

const config = Object.assign(applicationVars, envVars);

module.exports = config;
