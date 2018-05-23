import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";
import { logoutUser } from "../actions/auth";

class ChatSidebar extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLogoutClick(e) {
    e.preventDefault();

    this.props.logoutUser();
  }

  render() {
    return (
      <div id="chat-sidebar">
        <Menu.Item>
          <Menu.Header as="h2">Channels</Menu.Header>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header as="h2">Direct Messages</Menu.Header>
        </Menu.Item>
        <Menu.Item onClick={this.handleLogoutClick}>Logout</Menu.Item>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(ChatSidebar);
