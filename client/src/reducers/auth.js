import { USER_LOGGED_IN } from "../actions/types";

const defaultState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    default:
      return state;
  }
}
