const mongoose = require("mongoose");
const User = mongoose.model("User");
const UserMeta = mongoose.model("UserMeta");
const Room = mongoose.model("Room");
const Message = mongoose.model("Message");
const {
  CHAT_SERVICE_START,
  USER_CONNECTED,
  USER_DISCONNECTED,
  DISCONNECT,
  MESSAGE_ADD,
  MESSAGE_ADD_UNREAD,
  MESSAGE_ADDED,
  ROOM_OPEN,
  ROOM_CREATE,
  ROOM_CREATED
} = require("../utils/socketEvents");
const { initChatService, getRoomData } = require("../utils/chat");

/**
 * Initializes all of the server side socket events
 *
 * @param {*} io
 * @param {*} socket
 */
module.exports = function(io, socket) {
  /**
   * The client triggers CHAT_SERVICE_START socket event when the ChatRoom component renders
   * after succesfully logging in.
   */
  socket.on(CHAT_SERVICE_START, async (data, callback) => {
    console.log(`client connected ${socket.id}`);

    const { currentUserId } = data;

    const { currentUser, users, rooms, room, messages } = await initChatService(
      {
        socketId: socket.id,
        currentUserId
      }
    );

    socket.broadcast.emit(USER_CONNECTED, currentUser);

    callback({
      success: true,
      data: {
        currentUser,
        users,
        rooms,
        room,
        messages
      }
    });
  });

  /**
   * The client requested to create a new room.
   *
   * Create the new room
   * Add the room to each user in the room
   * Broadcast the new room to all of the client's
   */
  socket.on(ROOM_CREATE, async ({ group, name, users }, callback) => {
    //Create the room
    const newRoom = new Room({
      name,
      group,
      users,
      activeUsers: users
    });

    const userUpdates = users.reduce((array, userId) => {
      return [...array, User.joinRoom(userId, newRoom.id)];
    }, []);

    await Promise.all([newRoom.save(), ...userUpdates]).catch(e =>
      console.log(e)
    );

    socket.join(newRoom.id, () => {
      console.log(socket.rooms); // [ <socket.id>, 'room 237' ]
    });

    socket.broadcast.emit(ROOM_CREATED, { room: newRoom });

    callback({
      success: true,
      data: {
        room: newRoom,
        messages: []
      }
    });
  });

  /**
   * User requested to open a room
   *
   * if users is not empty, then you can assume it's a private message between 2 or more users
   *
   * if not, then just open a channel/room
   */
  socket.on(ROOM_OPEN, async (data, callback) => {
    const { currentUserId, roomId } = data;

    const { room, messages } = await getRoomData(roomId);

    if (room) {
      socket.join(room.id, () => {
        console.log(socket.rooms); // [ <socket.id>, 'room 237' ]
      });

      const [totalUnreadMessages, unreadMessageCount] = await Promise.all([
        UserMeta.get(currentUserId, "totalUnreadMessages"),
        UserMeta.getRoomMeta(currentUserId, roomId, "unreadMessageCount")
      ]);

      const updatedTotalUnreadMessages =
        totalUnreadMessages - unreadMessageCount;

      //Reset unreadMessageCount back to 0 when the client opens a room
      await Promise.all([
        UserMeta.setUnreadMessages(currentUserId, roomId, 0),
        UserMeta.setTotalUnreadMsgs(currentUserId, updatedTotalUnreadMessages)
      ]);

      callback({
        success: true,
        data: {
          activeRoom: room,
          messages
        }
      });
    }
  });

  /**
   * A message was submitted client side
   *
   * Create a new message
   * Add the message to the room
   * Broadcast the new message to the other clients
   *
   */
  socket.on(MESSAGE_ADD, async (data, callback) => {
    const { room, userId, input } = data;

    const message = new Message({
      created: Date.now(),
      roomId: room.id,
      user: userId,
      value: input
    });

    const updatedRoom = { ...room, messages: room.messages.concat(message.id) };

    //Save the Message and update room w/ new message
    await Promise.all([
      message.save(),
      Room.findByIdAndUpdate(updatedRoom.id, updatedRoom)
    ]).catch(e => console.log(e));

    socket.broadcast.emit(MESSAGE_ADDED, {
      userId,
      room: updatedRoom,
      message
    });

    callback({
      success: true,
      data: {
        room,
        message
      }
    });
  });

  /**
   * A message was submitted but not read.
   *
   * Increment the unreadMessagecount for that room in UserMeta
   *
   * ie: the user was either not online or the were not actively in the room of the message
   */
  socket.on(MESSAGE_ADD_UNREAD, async (data, callback) => {
    const { userId, room } = data;

    //Increment the unreadMessagecount if the message was unread - meaning the client is a part of the room
    //but not actively viewing the room
    UserMeta.incUnreadMsgCount(userId, room.id).catch(e => console.log(e));
    UserMeta.incTotalUnreadMsgs(userId).catch(e => console.log(e));
  });

  /**
   * Client disconnected from the application
   */
  socket.on(DISCONNECT, async () => {
    console.log(`client disconnected ${socket.id}`);

    //Remove the socketId from the user
    const user = await User.removeUserSocketId(socket.id);

    socket.broadcast.emit(USER_DISCONNECTED, user);
  });
};
