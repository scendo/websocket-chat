/**
 * Combine all of the reducers into one object
 */
import { combineReducers } from "redux";

import auth from "./auth";

const rootReducer = combineReducers({
  auth
});

export default rootReducer;
