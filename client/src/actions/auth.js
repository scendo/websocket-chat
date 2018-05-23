import axios from "axios";
import jwt_decode from "jwt-decode";
import { USER_LOGGED_IN } from "./types";
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
      const { token } = response.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      dispatch({
        type: USER_LOGGED_IN,
        payload: decoded
      });
    })
    .catch(error => {
      console.log(error.response);
    });
};
