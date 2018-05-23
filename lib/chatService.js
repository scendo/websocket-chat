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

    callback({
      success: true,
      data: {}
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
