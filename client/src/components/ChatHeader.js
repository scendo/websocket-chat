import React, { Component } from "react";

/**
 * Renders the name of the current room
 *
 * Additional chat settings may be added here later
 *
 * @param {*} props
 */
const ChatHeader = props => {
  const { activeRoom } = props;
  return (
    <div id="room-header">
      <span id="room-name">#{activeRoom.name}</span>
    </div>
  );
};

export default ChatHeader;
