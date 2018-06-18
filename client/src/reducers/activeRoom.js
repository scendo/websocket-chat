const {
  START_CHAT_SERVICE,
  ROOM_OPEN,
  USER_LOGGED_OUT,
  MESSAGE_ADD
} = require("../actions/types");

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_LOGGED_OUT:
      return {};
    case START_CHAT_SERVICE:
    case ROOM_OPEN: {
      const { room } = action.payload;
      return room;
    }

    case MESSAGE_ADD: {
      const { room, message } = action.payload;

      return {
        ...state,
        messages: [...state.messages, message]
      };
    }
    default:
      return state;
  }
}
