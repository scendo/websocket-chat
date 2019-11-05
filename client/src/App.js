import React, { Component } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Provider } from "react-redux";
import store from "./store";
import createHistory from "history/createBrowserHistory";
import { Switch, Router } from "react-router";
import { Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { SET_CURRENT_USER } from "./actions/types";
//Component
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ChatRoom from "./components/ChatRoom";
import PrivateRoute from "./components/PrivateRoute";
import PageNotFound from "./components/PageNotFound";

const history = createHistory();

class App extends Component {
  constructor(props) {
    super(props);

    const { auth } = store.getState();

    //Set current user if a valid jwt token exists and user isn't set
    if (!auth.isAuthenticated && localStorage.jwtToken) {
      const jwtDecoded = jwt_decode(localStorage.jwtToken);
      store.dispatch({
        type: SET_CURRENT_USER,
        payload: { jwtDecoded }
      });
    }
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={LoginForm} />
              <Route exact path="/signup" component={RegisterForm} />
              <PrivateRoute
                exact
                path="/chatroom"
                component={ChatRoom}
                componentProps={{
                  env: this.props.env,
                  apiUrl: this.props.apiUrl
                }}
              />
              <Route component={PageNotFound} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
