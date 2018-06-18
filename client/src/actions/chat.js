import {
  USER_CONNECTED,
  USER_DISCONNECTED,
  START_CHAT_SERVICE,
  ROOM_OPEN,
  ROOM_ADD,
  MESSAGE_ADD,
  MESSAGE_ADD_UNREAD
} from "./types";

/**
 * A user socket client connected to the chat service
 *
 * @param {*} user
 */
export const setUserConnected = user => {
  return {
    type: USER_CONNECTED,
    payload: { user }
  };
};

/**
 * User disconnected/logged out
 *
 * @param {*} user
 */
export const setUserDisconnected = user => {
  return {
    type: USER_DISCONNECTED,
    payload: { user }
  };
};

/**
 * Action to initialize a chatroom/private message
 *
 * @param {Object} socket
 * @param {Object} defaultRoom
 * @param {Object} messages
 * @param {Object} users
 */
export const startChatService = options => {
  return {
    type: START_CHAT_SERVICE,
    payload: options
  };
};

/**
 * Action to open a room
 *
 * @param {Object} room
 * @param {Object} messages
 */
export const openChatRoom = ({ room, messages }) => {
  return {
    type: ROOM_OPEN,
    payload: { room, messages }
  };
};

export const addRoom = room => {
  return {
    type: ROOM_ADD,
    payload: { room }
  };
};

export const addMessageToRoom = ({ room, message }) => {
  return {
    type: MESSAGE_ADD,
    payload: { room, message }
  };
};

export const addUnreadMessage = ({ room, currentUser }) => {
  return {
    type: MESSAGE_ADD_UNREAD,
    payload: { room, currentUser }
  };
};
