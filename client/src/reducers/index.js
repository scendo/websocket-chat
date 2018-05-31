/**
 * Combine all of the reducers into one object
 */
import { combineReducers } from "redux";

import auth from "./auth";
import currentUser from "./currentUser";
import socket from "./socket";
import users from "./users";
import rooms from "./rooms";
import activeRoom from "./activeRoom";
import messages from "./messages";
import errors from "./errors";

const rootReducer = combineReducers({
  auth,
  currentUser,
  socket,
  users,
  rooms,
  activeRoom,
  messages,
  errors
});

export default rootReducer;
