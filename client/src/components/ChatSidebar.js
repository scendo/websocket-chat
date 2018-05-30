import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Popup, Button, Icon } from "semantic-ui-react";
import { logoutUser } from "../actions/auth";
import soa from "../utils/socketActions";
import { setDirectMessageName } from "../utils/chat";

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
    const { socket, currentUser, users } = this.props;

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

          const options = {
            currentUser,
            room: activeRoom,
            messages
          };

          //dynamically update the room name if it's a direct message
          if (activeRoom.group === "direct") {
            options.room = setDirectMessageName({
              room: activeRoom,
              currentUser,
              users
            });
          }

          this.props.openChatRoom(options);
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

  /**
   * TODO: update to render all users, but grey out the users who do not have a socketID meaning they aren't connected
   */
  renderDirectMessages() {
    const { currentUser, rooms, users } = this.props;

    if (rooms.direct !== undefined) {
      /**
       * Only render the room if the current user is in the room
       */
      return rooms.direct.map((roomId, index) => {
        const room = rooms[roomId];
        const userId = room.users.find(
          (userId, index) => userId !== currentUser.id
        );
        const user = users[userId];

        return (
          <React.Fragment key={room.id}>
            <Menu.Item
              id={room.id}
              roomid={room.id}
              name={user.name}
              roomname={user.name}
              onClick={this.handleRoomClick}
            >
              <Icon
                color={user.socketId ? "green" : null}
                name={user.socketId ? "circle" : "circle outline"}
              />
              {user.name}
            </Menu.Item>
          </React.Fragment>
        );
      });
    }
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div id="chat-sidebar">
        <Menu.Item>
          <Icon
            color={currentUser.socketId ? "green" : null}
            name={currentUser.socketId ? "circle" : "circle outline"}
          />
          <Menu.Header as="h4">{currentUser.name}</Menu.Header>
        </Menu.Item>
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
          <Menu.Menu>{this.renderDirectMessages()}</Menu.Menu>
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
