import React, { Component } from "react";
import { Icon, Menu, Dropdown, Label } from "semantic-ui-react";

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * Renders unread message label on mobile menu
   */
  renderTotalUnreadMessagesLabel() {
    const { currentUser } = this.props;

    //Prevent render error when component attempts to load before the chat data has finished fetching
    if (Object.keys(currentUser).length === 0) {
      return null;
    }

    const { totalUnreadMessages } = currentUser.metaData;

    return (
      <Label
        className="unread-messages-label"
        circular={true}
        color="red"
        floating={true}
        style={{
          position: "absolute",
          top: "0.25em",
          left: "4.7em",
          display: totalUnreadMessages > 0 ? "initial" : "none"
        }}
        content={(() => {
          //Cap the output of totalUnread messages to a single digitl
          if (totalUnreadMessages > 0) {
            if (totalUnreadMessages >= 10) {
              return "9+";
            }
            return totalUnreadMessages;
          }
          return null;
        })()}
      />
    );
  }
  render() {
    const { currentUser, activeRoom } = this.props;

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
        <Menu.Item name="sidebar-menu" onClick={this.props.handleMenuClick}>
          <Icon name="sidebar" size="large" />
          {this.renderTotalUnreadMessagesLabel()}
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
                onClick={this.props.handleLogoutClick}
                style={{
                  textAlign: "center"
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Navbar;
