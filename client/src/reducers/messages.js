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
      const { messages } = action.payload;
      return messages || state;
    }

    case MESSAGE_ADD: {
      const { room, message } = action.payload;

      return {
        ...state,
        [message.id]: message
      };
    }
    default:
      return state;
  }
}
