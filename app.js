const express = require("express");
const session = require("express-session");
const expressValidator = require("express-validator");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const routes = require("./routes/index");

// initialize express app
const app = express();

// parse raw requests into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// exposes middleware methods onto req
app.use(expressValidator());

// populates req.cookies with cookies sent along with request
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Handle routes
app.use("/", routes);

module.exports = app;
