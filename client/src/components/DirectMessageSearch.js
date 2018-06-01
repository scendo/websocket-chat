import React, { Component } from "react";
import { Input, Button, Header, List, Icon } from "semantic-ui-react";
import soa from "../utils/socketActions";
import {
  unsetUser,
  getRoomsByGroup,
  getDirectMessage,
  setDirectMessageName
} from "../utils/chat";
/**
 * A form component to create/open a direct message
 */
class DirectMessageSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      matchedUsers: this.getMatchedUsers(props.users, "")
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
  }

  handleInputChange(e) {
    const { users } = this.props;
    const inputValue = e.target.value;

    this.setState({
      inputValue,
      matchedUsers: this.getMatchedUsers(users, inputValue)
    });
  }

  /**
   * A user was selected
   *
   * If the room doesn't exist, create it.
   *
   * Open the room.
   *
   * @param {*} e
   * @param {Object} data - data attributes on the user element
   * @param {string} data.userid - Name of the user
   * @param {string} data.roomid - roomid if the room exists otherwise undefined
   */
  handleUserClick(e, { userid, roomid }) {
    const {
      socket,
      currentUser,
      rooms,
      users,
      showRoom,
      addRoom,
      openChatRoom,
      setMenuVisibility
    } = this.props;

    const directRooms = getRoomsByGroup(rooms, "direct");
    const directMessage = getDirectMessage(directRooms, userid);
    setMenuVisibility(false);

    if (directMessage) {
      soa.openRoom(
        {
          socket,
          currentUserId: currentUser.id,
          roomId: directMessage.id
        },
        response => {
          if (response.success) {
            const { activeRoom, messages } = response.data;

            const updatedRoom = setDirectMessageName({
              room: activeRoom,
              currentUser,
              users
            });

            openChatRoom({
              currentUser,
              room: updatedRoom,
              messages
            });

            showRoom();
          }
        }
      );
    } else {
      //create
      soa.createRoom(
        {
          socket,
          group: "direct",
          name: "Direct Message",
          users: [currentUser.id, userid]
        },
        response => {
          if (response.success) {
            const { room, messages } = response.data;

            const updatedRoom = setDirectMessageName({
              room,
              currentUser,
              users
            });

            addRoom(updatedRoom);

            openChatRoom({
              currentUser,
              room: updatedRoom,
              messages
            });

            showRoom();
          }
        }
      );
    }
  }

  /**
   * Users .filter to match the user's input with a set of users
   * that contain the values being searched for
   *
   * @param {*} users
   * @param {*} inputValue
   */
  getMatchedUsers(users, inputValue) {
    const { currentUser } = this.props;
    const upperCaseInputValue = inputValue.toUpperCase();

    //Remove the current user from matched users
    const remainingUsers = unsetUser(users, currentUser.id);

    return Object.values(remainingUsers).filter((user, index) => {
      if (user.name.toUpperCase().indexOf(upperCaseInputValue) !== -1)
        return user;
    });
  }

  render() {
    const { users } = this.props;
    const { inputValue, matchedUsers } = this.state;

    return (
      <div id="chat-add-direct-message">
        <Header as="h2" content="Direct Messages" />
        <Button
          className="escape-chat-menu-btn"
          icon="remove"
          floated="right"
          size="big"
          onClick={this.props.showRoom}
        />
        <Input
          className="direct-message-search-input"
          size="huge"
          placeholder="Find or start a conversation"
          onChange={this.handleInputChange}
          value={this.state.inputValue}
        />
        <List id="direct-message-list" divided relaxed>
          {matchedUsers.map((user, index) => {
            return (
              <List.Item
                key={user.id}
                userid={user.id}
                style={{ cursor: "pointer" }}
                onClick={this.handleUserClick}
              >
                <List.Content>
                  <Icon
                    color={user.socketId ? "green" : null}
                    name={user.socketId ? "circle" : "circle outline"}
                  />
                  {user.name}
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      </div>
    );
  }
}

export default DirectMessageSearch;
