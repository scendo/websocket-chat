import { USER_LOGGED_IN, SET_CURRENT_USER } from "../actions/types";

const defaultState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: Object.keys(action.payload).length ? true : false,
        user: action.payload
      };
    default:
      return state;
  }
}
