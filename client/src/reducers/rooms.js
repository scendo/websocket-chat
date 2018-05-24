const { ROOM_OPEN } = require("../actions/types");

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ROOM_OPEN:
      const { rooms } = action.payload;
      return rooms;
    default:
      return state;
  }
}
