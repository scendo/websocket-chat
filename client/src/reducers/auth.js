import { USER_LOGGED_IN, SET_CURRENT_USER, ROOM_OPEN } from "../actions/types";

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

    case ROOM_OPEN:
      const { socket } = action.payload;

      return {
        ...state,
        user: {
          ...state.user,
          socket
        }
      };
    default:
      return state;
  }
}
