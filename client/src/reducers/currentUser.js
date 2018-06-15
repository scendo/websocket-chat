import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  SET_CURRENT_USER,
  ROOM_OPEN,
  MESSAGE_ADD,
  MESSAGE_ADD_UNREAD
} from "../actions/types";

const defaultState = {};

export default function(state = defaultState, action) {
  switch (action.type) {
    case USER_LOGGED_OUT:
      return {};

    case ROOM_OPEN:
      const { socket, currentUser, room } = action.payload;

      const updatedState = {
        ...currentUser
      };

      if (socket) {
        updatedState.socketId = socket.id;
      }

      return resetMessageCount(updatedState, room.id);

    case MESSAGE_ADD_UNREAD: {
      const { room, currentUser, read } = action.payload;

      return incrementMessageCount(state, room.id);
    }

    default:
      return state;
  }
}

/**
 * incremements unreadMessageCount in userMeta for a given room
 */
const incrementMessageCount = (state, roomId) => {
  const metaKey = `room_${roomId}`;

  const updatedState = { ...state };

  if (updatedState.metaData[metaKey] === undefined) {
    updatedState.metaData[metaKey] = {
      unreadMessageCount: 0
    };
  }

  return {
    ...updatedState,
    metaData: {
      [metaKey]: {
        ...updatedState.metaData[metaKey],
        unreadMessageCount: (updatedState.metaData[
          metaKey
        ].unreadMessageCount += 1)
      },
      totalUnreadMessages: (updatedState.metaData.totalUnreadMessages += 1)
    }
  };
};

/**
 * Resets unreadMessageCount to 0 in userMeta for a given room
 */
const resetMessageCount = (state, roomId) => {
  const metaKey = `room_${roomId}`;

  return {
    ...state,
    metaData: {
      ...state.metaData,
      [metaKey]: {
        unreadMessageCount: 0
      }
    }
  };
};
