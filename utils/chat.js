const uniqid = require("uniqid");
const promisify = require("es6-promisify");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Room = mongoose.model("Room");
const Message = mongoose.model("Message");

/**
 *
 * Client is requesting to start the chat service
 *
 *  Need to serve the initial chat data
 *
 *  All Rooms
 *  All Users?
 *  Default Room
 *  Messages in the room
 *
 */
initChatService = async ({ socketId, currentUserId }) => {
  const channels = [];
  const direct = [];

  const currentUserPromise = User.findByIdAndUpdate(
    currentUserId,
    { socketId },
    { new: true }
  );
  const defaultRoomPromise = Room.findOne({
    name: "Community",
    group: "channel"
  });

  const [currentUser, defaultRoom] = await Promise.all([
    currentUserPromise,
    defaultRoomPromise
  ]).catch(e => console.log(e));

  //Fetch all of the chat data for the client
  const allUsersPromise = User.find(
    {},
    {
      rooms: 1,
      name: 1,
      socketId: 1,
      metaData: 1
    }
  );
  const roomsPromise = Room.find({
    _id: { $in: [defaultRoom.id, ...currentUser.rooms] }
  });
  const messagesPromise = Message.find({
    _id: {
      $in: defaultRoom.messages
    }
  });
  const [usersRooms, allUsers, messagesInRoom] = await Promise.all([
    roomsPromise,
    allUsersPromise,
    messagesPromise
  ]).catch(e => console.log(e));

  //Reduce the arrays into key value objects
  const users = allUsers.reduce((obj, user) => {
    return { ...obj, [user.id]: user.toJSON() };
  }, {});

  const messages = messagesInRoom.reduce((obj, message) => {
    return { ...obj, [message.id]: message.toJSON() };
  }, {});

  const rooms = usersRooms.reduce(
    (obj, room) => {
      const newObj = { ...obj, [room.id]: room.toJSON() };

      switch (room.group) {
        case "channel":
          newObj.channels = newObj.channels.concat(room.id);
          break;

        case "direct":
          newObj.direct = newObj.direct.concat(room.id);
          break;
      }

      return newObj;
    },
    { channels: [], direct: [] }
  );

  return {
    users,
    room: defaultRoom,
    rooms,
    messages
  };
};

/**
 * Returns the room and messages in the room
 */
getRoomData = async roomId => {
  const room = await Room.findById(roomId);

  const messages = await Message.find({
    _id: {
      $in: room.messages
    }
  });
  return {
    room,
    messages
  };
};

module.exports = {
  initChatService,
  getRoomData
};
