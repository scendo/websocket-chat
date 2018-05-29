const mongoose = require("mongoose");
const User = mongoose.model("User");
const Room = mongoose.model("Room");
const Message = mongoose.model("Message");
const {
  CHAT_SERVICE_START,
  DISCONNECT,
  MESSAGE_ADD,
  MESSAGE_ADDED,
  ROOM_CREATE
} = require("../utils/socketEvents");
const { initChatService } = require("../utils/chat");
module.exports = function(io, socket) {
  socket.on(CHAT_SERVICE_START, async (data, callback) => {
    console.log(`client connected ${socket.id}`);

    const { currentUserId } = data;

    const { users, rooms, room, messages } = await initChatService({
      socketId: socket.id,
      currentUserId
    });

    callback({
      success: true,
      data: {
        users,
        rooms,
        room,
        messages
      }
    });
  });

  socket.on(DISCONNECT, async () => {
    console.log(`client disconnected ${socket.id}`);

    //Remove the socketId from the user
    const user = await User.findOneAndUpdate(
      { socketId: socket.id },
      { $unset: { socketId: "" } },
      { new: true }
    );
  });

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

    callback({
      success: true,
      data: {
        room: newRoom,
        messages: []
      }
    });
  });
};
