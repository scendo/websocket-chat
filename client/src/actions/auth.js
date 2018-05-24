import axios from "axios";
import jwt_decode from "jwt-decode";
import { USER_LOGGED_IN, USER_LOGGED_OUT, SET_CURRENT_USER } from "./types";
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
      const jwtDecoded = jwt_decode(token);

      dispatch({
        type: USER_LOGGED_IN,
        payload: jwtDecoded
      });
    })
    .catch(error => {
      console.log(error.response);
    });
};

export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Set current user to {} which will set isAuthenticated to false
  dispatch({
    type: USER_LOGGED_OUT
  });
};

export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};
