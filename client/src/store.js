import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

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
const store = createStore(
  (state, action) => {
    return state;
  },
  defaultState,
  enhancers
);

export default store;
