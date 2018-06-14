import React, { Component } from "react";
import { Icon, Menu, Dropdown } from "semantic-ui-react";

const Navbar = props => {
  const { currentUser, activeRoom } = props;

  const trigger = (
    <span>
      <Icon
        color={currentUser.socketId ? "green" : null}
        name={currentUser.socketId ? "circle" : "circle outline"}
      />
      {currentUser.name}
    </span>
  );

  return (
    <Menu id="chat-menu">
      <Menu.Item name="sidebar-menu" onClick={props.handleMenuClick}>
        <Icon name="sidebar" size="large" />
      </Menu.Item>
      <div id="room-header">
        <span id="room-name">#{activeRoom.name}</span>
      </div>
      <Menu.Menu position="right">
        <Dropdown
          id="user-settings-menu"
          trigger={trigger}
          icon="dropdown"
          item
        >
          <Dropdown.Menu position="right">
            <Dropdown.Item
              text="Logout"
              onClick={props.handleLogoutClick}
              style={{
                textAlign: "center"
              }}
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    </Menu>
  );
};

export default Navbar;
