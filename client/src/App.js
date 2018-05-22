import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Websocket Chat Application</h1>
          </header>
        </div>
      </Provider>
    );
  }
}

export default App;
