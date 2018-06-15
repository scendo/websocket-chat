import {
  USER_CONNECTED,
  USER_DISCONNECTED,
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
export const openChatRoom = options => {
  return {
    type: ROOM_OPEN,
    payload: options
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
