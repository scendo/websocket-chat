import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

class ChatSidebar extends Component {
  constructor(props) {
    super(props);
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
        <Menu.Item>Logout</Menu.Item>
      </div>
    );
  }
}
export default ChatSidebar;
