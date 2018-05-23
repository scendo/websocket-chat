const mongoose = require("mongoose");
const User = mongoose.model("User");
const { CHAT_SERVICE_START, DISCONNECT } = require("../utils/socketEvents");

module.exports = function(io, socket) {
  socket.on(CHAT_SERVICE_START, async (data, callback) => {
    console.log(`client connected ${socket.id}`);

    const { currentUserId } = data;

    const user = await User.findByIdAndUpdate(
      currentUserId,
      { socketId: socket.id },
      { new: true }
    );
  });

  socket.on(DISCONNECT, () => {
    console.log(`client disconnected ${socket.id}`);
  });
};
