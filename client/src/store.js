import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

const defaultState = {};
const middleware = [thunk];

//Add redux-thunk and redux chrome dev tools
const enhancers = compose(
  applyMiddleware(...middleware),
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
);

//Create the store
const store = createStore(rootReducer, defaultState, enhancers);

export default store;
