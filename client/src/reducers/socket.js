const {
  START_CHAT_SERVICE,
  ROOM_OPEN,
  USER_LOGGED_OUT
} = require("../actions/types");

const defaultState = null;

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_LOGGED_OUT:
      return null;
    case START_CHAT_SERVICE:
      const { socket } = action.payload;
      return socket || state;

    default:
      return state;
  }
}
