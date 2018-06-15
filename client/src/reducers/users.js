const {
  USER_CONNECTED,
  ROOM_OPEN,
  USER_LOGGED_OUT
} = require("../actions/types");

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_CONNECTED: {
      const { user } = action.payload;
      return {
        ...state,
        [user.id]: user
      };
    }
    case USER_LOGGED_OUT:
      return {};
    case ROOM_OPEN: {
      const { users } = action.payload;
      return users || state;
    }
    default:
      return state;
  }
}
