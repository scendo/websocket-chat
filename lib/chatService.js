module.exports = function(io, socket) {
  socket.on("CHAT_SERVICE_START", () => {
    console.log(`client connected ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`client disconnected ${socket.id}`);
  });
};
