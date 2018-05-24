/**
 * Combine all of the reducers into one object
 */
import { combineReducers } from "redux";

import auth from "./auth";
import users from "./users";
import rooms from "./rooms";
import room from "./room";
import messages from "./messages";

const rootReducer = combineReducers({
  auth,
  users,
  rooms,
  room,
  messages
});

export default rootReducer;
