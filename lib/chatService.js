const { CHAT_SERVICE_START, DISCONNECT } = require("../utils/socketEvents");

module.exports = function(io, socket) {
  socket.on(CHAT_SERVICE_START, () => {
    console.log(`client connected ${socket.id}`);
  });

  socket.on(DISCONNECT, () => {
    console.log(`client disconnected ${socket.id}`);
  });
};
