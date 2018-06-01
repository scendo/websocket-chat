import React, { Component } from "react";

const ChatHeader = props => {
  const { activeRoom } = props;
  return (
    <div id="room-header">
      <span id="room-name">#{activeRoom.name}</span>
    </div>
  );
};

export default ChatHeader;
