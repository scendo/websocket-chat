const { REGISTER_SUCCESS, REGISTER_ERROR } = require("../actions/types");

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case REGISTER_ERROR:
      return {
        type: "register",
        data: action.payload
      };

    default:
      return state;
  }
}
