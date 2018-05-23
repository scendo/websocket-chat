import React, { Component } from "react";
import { connect } from "react-redux";
import Navbar from "./Navbar";

class Chatroom extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="chatroom">
        <Navbar />
        <h1>Chatroom</h1>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default Chatroom;
