import axios from "axios";

/**
 * Log the user in
 *
 * Sends the user credentials to the server side for verification
 * If successful, the response will contain a jsonwebtoken and
 * a redux action will be triggered
 *
 */
export const loginUser = (email, password) => dispatch => {
  axios
    .post("/api/v1/login", { email, password })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error.response);
    });
};
