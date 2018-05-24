import React, { Component } from "react";

class ChatHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { activeRoom } = this.props;
    return (
      <div id="room-header">
        <span id="room-name">#{activeRoom.name}</span>
      </div>
    );
  }
}

export default ChatHeader;
