// Import models
const Message = require("../models/Message");
const Room = require("../models/Room");
const User = require("../models/User");
const UserMeta = require("../models/UserMeta");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const { getRandomColor } = require("../utils/chat");

/**
 * Load sample application data
 *
 * @param {} param0
 */
const loadData = async ({
  users,
  rooms,
  channelsRooms,
  directRooms,
  messages
}) => {
  try {
    const usermetas = getUserMetas({ users, directRooms });
    const insertMessagePromise = Message.insertMany(messages);
    const insertRoomPromise = Room.insertMany(rooms);
    const insertUserPromise = User.insertMany(users);
    const insertUserMetaPromise = UserMeta.insertMany(usermetas);

    await Promise.all([
      insertMessagePromise,
      insertRoomPromise,
      insertUserPromise,
      insertUserMetaPromise
    ]).catch(e => console.log(e));

    console.log("loading sample data... complete!");
    process.exit();
  } catch (e) {
    console.log("Error! loading sample data failed!");
    console.log(e);
    process.exit();
  }
};

/**
 * Delete sample application data
 */
const deleteData = async () => {
  console.log("Deleting data...");

  const removeMessagesPromise = Message.remove();
  const removeRoomsPromise = Room.remove();
  const removeUsersPromise = User.remove();
  const removeUserMetaPromise = UserMeta.remove();

  await Promise.all([
    removeMessagesPromise,
    removeRoomsPromise,
    removeUsersPromise,
    removeUserMetaPromise
  ]).catch(e => console.log(e));

  console.log("Data successfully deleted!");
  process.exit();
};

/**
 * Get dynamically generated user metas
 *
 * roomMetas - metaField for each direct message a user is in
 * badgeColor - color of the user's badge/circle next to their name in a message
 * totalUnreadMessages - count of total unread direct messages
 */
const getUserMetas = ({ users, directRooms }) => {
  const userMetas = [];

  /**
   * Dynamically generate a room meta document for each direct message a user is in room
   */
  const roomMetas = directRooms.reduce((arr, room) => {
    const roomMetaPerUser = room.users.reduce((arr, userId) => {
      return [
        ...arr,
        {
          userId: userId,
          key: `room_${room._id}`,
          value: {
            unreadMessageCount: 0
          }
        }
      ];
    }, []);

    return [...arr, ...roomMetaPerUser];
  }, []);

  /**
   * General userMeta for each user
   */
  const generalUserMeta = users.reduce((arr, user) => {
    return [
      ...arr,
      {
        userId: user._id,
        key: "badgeColor",
        value: getRandomColor()
      },
      {
        userId: user._id,
        key: "totalUnreadMessages",
        value: 0
      }
    ];
  }, []);

  return userMetas.concat(roomMetas, generalUserMeta);
};

module.exports = {
  loadData,
  deleteData,
  getRandomColor,
  getUserMetas
};
