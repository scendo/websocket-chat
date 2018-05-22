import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";
import createHistory from "history/createBrowserHistory";
import { Router } from "react-router";
import { Route } from "react-router-dom";
import "./App.css";

const history = createHistory();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route
            exact
            path="/"
            render={props => {
              const { match, location, history } = props;

              return (
                <div className="App">
                  <header className="App-header">
                    <h1 className="App-title">Websocket Chat Application</h1>
                  </header>
                </div>
              );
            }}
          />
        </Router>
      </Provider>
    );
  }
}

export default App;
