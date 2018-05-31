const {
  LOGIN_ERROR,
  REGISTER_SUCCESS,
  REGISTER_ERROR
} = require("../actions/types");

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case LOGIN_ERROR: {
      return {
        type: "login",
        data: action.payload
      };
    }
    case REGISTER_ERROR:
      return {
        type: "register",
        data: action.payload
      };

    default:
      return state;
  }
}
