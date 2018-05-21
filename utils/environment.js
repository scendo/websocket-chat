/**
 * Returns an object of environment variables based on the current environment
 *
 * @param {*} environment
 */
exports.getEnvVars = environment => {
  switch (environment) {
    case "development":
      return require("../config/environments/development");
    case "staging":
      return require("../config/environments/staging");
    case "production":
      return require("../config/environments/production");
  }
};
