require("dotenv").config({ path: __dirname + "/../variables.env" });
const fs = require("fs");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

// Import models
const User = require("../models/User");

// read and parse sample data json
const users = JSON.parse(fs.readFileSync(__dirname + "/users.json", "utf-8"));

const loadData = async () => {
  try {
    await User.insertMany(users);
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
  await User.remove();
  console.log("Data successfully deleted!");
  process.exit();
};

if (process.argv.includes("--delete")) {
  deleteData();
} else {
  loadData();
}
