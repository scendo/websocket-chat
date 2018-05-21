const { getEnvVars } = require("../utils/environment");

//Import environment specific variables
const envVars = getEnvVars(process.env.NODE_ENV);

//General Application config variables
const applicationVars = {};

const config = Object.assign(applicationVars, envVars);

module.exports = config;
