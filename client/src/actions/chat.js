import { ROOM_OPEN } from "./types";

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
