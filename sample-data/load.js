require("dotenv").config({ path: __dirname + "/../variables.env" });
const fs = require("fs");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

// Import models
const Message = require("../models/Message");
const Room = require("../models/Room");
const User = require("../models/User");
const UserMeta = require("../models/UserMeta");

// read and parse sample data json
const messages = JSON.parse(
  fs.readFileSync(__dirname + "/messages.json", "utf-8")
);
const channelsRooms = JSON.parse(
  fs.readFileSync(__dirname + "/rooms/channels.json", "utf-8")
);
const directRooms = JSON.parse(
  fs.readFileSync(__dirname + "/rooms/direct.json", "utf-8")
);
const rooms = channelsRooms.concat(directRooms);
const users = JSON.parse(fs.readFileSync(__dirname + "/users.json", "utf-8"));

/**
 * Dynamically generate UerMeta for each direct message room
 */
const usermetas = directRooms.reduce((arr, room) => {
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

const loadData = async () => {
  try {
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

if (process.argv.includes("--delete")) {
  deleteData();
} else {
  loadData();
}
