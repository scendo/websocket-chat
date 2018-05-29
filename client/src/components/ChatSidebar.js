import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Popup, Button, Icon } from "semantic-ui-react";
import { logoutUser } from "../actions/auth";
import soa from "../utils/socketActions";

class ChatSidebar extends Component {
  constructor(props) {
    super(props);

    this.handleRoomClick = this.handleRoomClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  /**
   * Open the clicked chat room
   *
   * @param {*} e
   * @param {*} param1
   */
  handleRoomClick(e, { roomid }) {
    const { socket, currentUser } = this.props;

    soa.openRoom(
      {
        socket,
        currentUserId: currentUser.id,
        roomId: roomid
      },
      response => {
        if (response.success) {
          const { activeRoom, messages } = response.data;
          this.props.setMenuVisibility(false);
          this.props.openChatRoom({
            currentUser,
            room: activeRoom,
            messages
          });
        }
      }
    );
  }

  handleLogoutClick(e) {
    e.preventDefault();

    this.props.logoutUser();
  }

  renderChannels() {
    const { rooms } = this.props;

    if (rooms.channels === undefined) {
      return;
    }

    return rooms.channels.map((roomId, index) => {
      const room = rooms[roomId];
      return (
        <Menu.Item
          key={room.id}
          roomid={room.id}
          icon="hashtag"
          name={room.name}
          onClick={this.handleRoomClick}
        />
      );
    });
  }

  render() {
    return (
      <div id="chat-sidebar">
        <Menu.Item>
          <Menu.Header as="h2">
            Channels
            <Popup
              position="bottom left"
              trigger={
                <Button
                  floated="right"
                  size="large"
                  className="sidebar-add-chat-btn"
                  icon={
                    <Icon
                      color="grey"
                      name="add circle"
                      className="sidebar-add-chat-icon"
                      onClick={this.props.handleCreateChannelClick}
                    />
                  }
                />
              }
              content="Create a new channel"
              style={{
                opacity: 0.9,
                padding: "2em"
              }}
              size="mini"
              inverted
            />
          </Menu.Header>
          <Menu.Menu>{this.renderChannels()}</Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header as="h2">
            Direct Messages
            <Popup
              trigger={
                <Button
                  floated="right"
                  size="large"
                  className="sidebar-add-chat-btn"
                  icon={
                    <Icon name="add circle" className="sidebar-add-chat-icon" />
                  }
                  onClick={this.props.handleAddDirectMessageClick}
                />
              }
              content="Open a direct message"
              style={{
                opacity: 0.9,
                padding: "2em"
              }}
              size="mini"
              inverted
            />
          </Menu.Header>
        </Menu.Item>
        <Menu.Item onClick={this.handleLogoutClick}>Logout</Menu.Item>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  rooms: state.rooms
});

export default connect(mapStateToProps, { logoutUser })(ChatSidebar);
