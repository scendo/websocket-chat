/**
 * Fetches all of default chat data to intialize the chat app client side
 *
 * @param {Object} socket
 * @param {Object} currentUserId
 * @callback
 * {
 *  success: boolean,
 *     data: {
 *       users,
 *       rooms,
 *       room,
 *       messages
 *     }
 * }
 */
const startChatService = ({ socket, currentUserId }, callback) => {
  socket.emit("CHAT_SERVICE_START", { currentUserId }, response => {
    const options = { socket, ...response.data };

    callback(options);
  });
};

/**
 * Fetches the opened room data
 *
 * @param {Object} socket
 * @param {Object} currentUserId
 * @param {Object} roomId
 * @callback
 * {
 *  success: boolean,
 *     data: {
 *       activeRoom,
 *       messages
 *     }
 * }
 */
const openRoom = ({ socket, currentUserId, roomId }, callback) => {
  socket.emit(
    "ROOM_OPEN",
    {
      currentUserId,
      roomId
    },
    response => {
      callback(response);
    }
  );
};

/**
 *
 * @param {Object} socket
 * @param {Object} group
 * @param {Object} name
 * @param {Object} users
 * @callback
 * {
 *  success: boolean,
 *     data: {
 *       room,
 *       messages
 *     }
 * }
 */
const createRoom = ({ socket, group, name, users }, callback) => {
  socket.emit(
    "ROOM_CREATE",
    {
      group,
      name,
      users
    },
    response => {
      callback(response);
    }
  );
};

/**
 * Emits MESSAGE_ADD_UNREAD to increment the unreadMessageCount in UserMeta for a room
 *
 * @param {Object} socket
 * @param {Object} userId
 * @param {Object} room
 */
const addUnreadMessage = ({ socket, userId, room }) => {
  socket.emit("MESSAGE_ADD_UNREAD", { userId, room });
};

export default {
  startChatService,
  openRoom,
  createRoom,
  addUnreadMessage
};
