import { ROOM_OPEN, MESSAGE_ADD } from "./types";

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

export const addMessageToRoom = (room, message) => {
  return {
    type: MESSAGE_ADD,
    payload: { room, message }
  };
};
