const { ROOM_OPEN, ROOM_ADD, USER_LOGGED_OUT } = require("../actions/types");

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_LOGGED_OUT:
      return {};
    case ROOM_OPEN: {
      const { rooms } = action.payload;
      return rooms || state;
    }

    case ROOM_ADD: {
      const { room } = action.payload;

      const newState = {
        ...state,
        [room.id]: room
      };

      if (room.group === "direct") {
        newState.direct = newState.direct.concat(room.id);
      } else if (room.group === "channel") {
        newState.channels = newState.channels.concat(room.id);
      }

      return newState;
    }

    default:
      return state;
  }
}
