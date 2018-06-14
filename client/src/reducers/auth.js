import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  SET_CURRENT_USER,
  ROOM_OPEN
} from "../actions/types";

const defaultState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
    case SET_CURRENT_USER: {
      const { jwtDecoded } = action.payload;
      return {
        isAuthenticated: Object.keys(action.payload).length > 0 ? true : false,
        user: jwtDecoded
      };
    }

    case USER_LOGGED_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {}
      };

    default:
      return state;
  }
}
