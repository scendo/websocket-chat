import React, { Component } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Provider } from "react-redux";
import store from "./store";
import createHistory from "history/createBrowserHistory";
import { Router } from "react-router";
import { Route } from "react-router-dom";

//Components
import LoginForm from "./components/LoginForm";

const history = createHistory();

class App extends Component {
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
