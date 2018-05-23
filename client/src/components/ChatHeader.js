import React, { Component } from "react";

class ChatHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="room-header">
        <span id="room-name">#Community</span>
      </div>
    );
  }
}

export default ChatHeader;
