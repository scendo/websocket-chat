const mongoose = require("mongoose");
const User = mongoose.model("User");
const UserMeta = mongoose.model("UserMeta");
const Room = mongoose.model("Room");
const Message = mongoose.model("Message");
const {
  CHAT_SERVICE_START,
  DISCONNECT,
  MESSAGE_ADD,
  MESSAGE_ADD_UNREAD,
  MESSAGE_ADDED,
  ROOM_OPEN,
  ROOM_CREATE,
  ROOM_CREATED
} = require("../utils/socketEvents");
const { initChatService, getRoomData } = require("../utils/chat");
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

  socket.on(ROOM_CREATE, async ({ group, name, users }, callback) => {
    //Create the room
    const newRoom = new Room({
      name,
      group,
      users,
      activeUsers: users
    });

    const userUpdates = users.reduce((array, userId) => {
      return [
        ...array,
        User.findByIdAndUpdate(userId, { $addToSet: { rooms: newRoom.id } })
      ];
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

      //Reset unreadMessageCount back to 0 when the client opens a room
      UserMeta.findOneAndUpdate(
        {
          userId: currentUserId,
          key: `room_${roomId}`
        },
        { $set: { "value.unreadMessageCount": 0 } }
      ).catch(e => console.log(e));

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
   *
   */
  socket.on(MESSAGE_ADD_UNREAD, async (data, callback) => {
    const { userId, room } = data;

    //Increment the unreadMessagecount if the message was unread - meaning the client is a part of the room
    //but not actively viewing the room
    UserMeta.findOneAndUpdate(
      {
        userId,
        key: `room_${room.id}`
      },
      { $inc: { "value.unreadMessageCount": 1 } }
    ).catch(e => console.log(e));
  });

  /**
   *
   */
  socket.on(DISCONNECT, async () => {
    console.log(`client disconnected ${socket.id}`);

    //Remove the socketId from the user
    const user = await User.findOneAndUpdate(
      { socketId: socket.id },
      { $unset: { socketId: "" } },
      { new: true }
    );
  });
};
