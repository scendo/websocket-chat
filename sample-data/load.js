require("dotenv").config({ path: __dirname + "/../variables.env" });
const fs = require("fs");

const {
  loadData,
  deleteData,
  getRandomColor,
  getUserMetas
} = require("./helpers");

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
const usermetas = getUserMetas({ users, directRooms });

if (process.argv.includes("--delete")) {
  deleteData();
} else {
  loadData({
    users,
    usermetas,
    rooms,
    channelsRooms,
    directRooms,
    messages
  });
}
