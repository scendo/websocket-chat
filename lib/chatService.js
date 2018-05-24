const mongoose = require("mongoose");
const User = mongoose.model("User");
const { CHAT_SERVICE_START, DISCONNECT } = require("../utils/socketEvents");
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
};
