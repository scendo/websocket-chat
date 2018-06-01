const uniqid = require("uniqid");
const promisify = require("es6-promisify");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const UserMeta = mongoose.model("UserMeta");
const Room = mongoose.model("Room");
const Message = mongoose.model("Message");

/**
 * All of the necessary chat application data needs to be prepared and sent to the client.
 *
 *  - currentUser
 *  - users
 *  - rooms
 *  - room
 *  - messages
 */
const initChatService = async ({ socketId, currentUserId }) => {
  const channels = [];
  const direct = [];

  /**
   * Get currentUser and defaultRoom
   *
   * Update the current user w/ the new socketId
   */

  const currentUserPromise = User.updateUserSocketId(currentUserId, socketId);
  const defaultRoomPromise = Room.findOne({
    name: "Community",
    group: "channel"
  });
  const [currentUser, defaultRoom] = await Promise.all([
    currentUserPromise,
    defaultRoomPromise
  ]).catch(e => console.log(e));

  /**
   * Fetch all of the chat data
   */
  const [
    currentUserMeta,
    usersRooms,
    allUsers,
    messagesInRoom
  ] = await Promise.all([
    UserMeta.getAllUserMeta(currentUser.id),
    Room.getRooms(currentUser.rooms),
    User.getAllUsers(),
    Message.getMessages(defaultRoom.messages)
  ]).catch(e => console.log(e));

  const { users, userMeta, messages, rooms } = formatChatServiceData({
    allUsers,
    currentUserMeta,
    messagesInRoom,
    usersRooms
  });

  return {
    currentUser: { ...currentUser.toJSON(), metaData: userMeta },
    users,
    room: defaultRoom,
    rooms,
    messages
  };
};

/**
 * Reduces in the chat service data into objects of key => value pairs
 *
 * The data is reduced so the front end can access data faster vs having to loop through
 * an indefinite array length to find/edit the data.
 *
 */
const formatChatServiceData = ({
  allUsers,
  currentUserMeta,
  messagesInRoom,
  usersRooms
}) => {
  //Reduce the arrays into key value objects
  const users = allUsers.reduce((obj, user) => {
    return { ...obj, [user.id]: user.toJSON() };
  }, {});

  const userMeta = currentUserMeta.reduce((obj, userMeta) => {
    return { ...obj, [userMeta.key]: userMeta.value };
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
    userMeta,
    messages,
    rooms
  };
};

/**
 * Returns the room and messages in the room
 */
const getRoomData = async roomId => {
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
