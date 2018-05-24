require("dotenv").config({ path: __dirname + "/../variables.env" });
const fs = require("fs");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

// Import models
const Message = require("../models/Message");
const User = require("../models/User");

// read and parse sample data json
const messages = JSON.parse(
  fs.readFileSync(__dirname + "/messages.json", "utf-8")
);
const users = JSON.parse(fs.readFileSync(__dirname + "/users.json", "utf-8"));

const loadData = async () => {
  try {
    const insertMessagePromise = Message.insertMany(messages);
    const insertUserPromise = User.insertMany(users);

    await Promise.all([insertMessagePromise, insertUserPromise]).catch(e =>
      console.log(e)
    );

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
  const removeUsersPromise = User.remove();

  await Promise.all([removeMessagesPromise, removeUsersPromise]).catch(e =>
    console.log(e)
  );

  console.log("Data successfully deleted!");
  process.exit();
};

if (process.argv.includes("--delete")) {
  deleteData();
} else {
  loadData();
}
