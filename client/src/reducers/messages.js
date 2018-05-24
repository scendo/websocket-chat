const { ROOM_OPEN } = require("../actions/types");

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ROOM_OPEN:
      const { messages } = action.payload;
      return messages;

    default:
      return state;
  }
}
