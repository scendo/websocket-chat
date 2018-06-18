import {
  USER_CONNECTED,
  USER_DISCONNECTED,
  START_CHAT_SERVICE,
  ROOM_ADD,
  USER_LOGGED_OUT
} from "../actions/types";

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_CONNECTED: {
      const { user } = action.payload;
      return updateUser(state, user);
    }
    case USER_DISCONNECTED: {
      const { user } = action.payload;
      return updateUser(state, user);
    }
    case USER_LOGGED_OUT:
      return {};
    case START_CHAT_SERVICE: {
      const { users } = action.payload;
      return users || state;
    }
    default:
      return state;
  }
}

const updateUser = (state, user) => {
  return {
    ...state,
    [user.id]: user
  };
};
