const mongoose = require("mongoose");
const User = mongoose.model("User");
const Room = mongoose.model("Room");
const Message = mongoose.model("Message");
const {
  CHAT_SERVICE_START,
  DISCONNECT,
  MESSAGE_ADD,
  MESSAGE_ADDED
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

    callback({
      success: true,
      data: {
        room,
        message
      }
    });
  });
};
