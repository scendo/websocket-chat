import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  SET_CURRENT_USER,
  ROOM_OPEN
} from "../actions/types";

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
    case SET_CURRENT_USER:
      return action.payload;

    case USER_LOGGED_OUT:
      return {};

    case ROOM_OPEN:
      const { socket, currentUser } = action.payload;

      const newState = {
        ...currentUser
      };

      if (socket) {
        newState.socketId = socket.id;
      }

      return newState;

    default:
      return state;
  }
}
