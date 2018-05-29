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
    case SET_CURRENT_USER:
      return {
        isAuthenticated: Object.keys(action.payload).length > 0 ? true : false,
        user: action.payload
      };

    case USER_LOGGED_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {}
      };

    case ROOM_OPEN:
      const { socket } = action.payload;

      const newState = {
        ...state,
        user: {
          ...state.user
        }
      };

      if (socket) {
        newState.user.socketId = socket.id;
      }

      return newState;

    default:
      return state;
  }
}
