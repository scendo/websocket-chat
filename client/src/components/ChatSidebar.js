import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

class ChatSidebar extends Component {
  constructor(props) {
    super(props);

    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLogoutClick(e) {
    e.preventDefault();

    console.log("logout");
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
export default ChatSidebar;
