const { ROOM_OPEN, USER_LOGGED_OUT } = require("../actions/types");

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_LOGGED_OUT:
      return {};
    case ROOM_OPEN:
      const { room } = action.payload;
      return room;

    default:
      return state;
  }
}
