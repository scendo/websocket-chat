const { ROOM_OPEN } = require("../actions/types");

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ROOM_OPEN:
      const { users } = action.payload;
      return users;
    default:
      return state;
  }
}
