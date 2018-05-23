import React, { Component } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Provider } from "react-redux";
import store from "./store";
import createHistory from "history/createBrowserHistory";
import { Router } from "react-router";
import { Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { SET_CURRENT_USER } from "./actions/types";
//Components
import LoginForm from "./components/LoginForm";

const history = createHistory();

class App extends Component {
  constructor(props) {
    super(props);

    const { auth } = store.getState();

    //Set current user if a valid jwt token exists and user isn't set
    if (!auth.isAuthenticated && localStorage.jwtToken) {
      const decoded = jwt_decode(localStorage.jwtToken);
      store.dispatch({
        type: SET_CURRENT_USER,
        payload: decoded
      });
    }
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route exact path="/" component={LoginForm} />
        </Router>
      </Provider>
    );
  }
}

export default App;
