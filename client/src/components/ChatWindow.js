import React, { Component } from "react";
import { List, Form, Divider } from "semantic-ui-react";
import UserBadge from "./UserBadge";
import ChatMessageInput from "./ChatMessageInput";
/**
 * Handles the Chat Window displaying the room's messages
 *
 * Also handles the room's message input field
 */
class ChatWindow extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.scrollToBottomOfChat();
  }

  componentDidUpdate() {
    this.scrollToBottomOfChat();
  }

  /**
   * Groups messages by date
   *
   * @param {*} messages
   */
  groupMessagesByDate(messages) {
    const messagesByDate = Object.values(this.props.messages).reduce(
      (obj, message) => {
        const date = new Date(message.created);

        const dateKey = this.fromToday(date)
          ? "today"
          : date
              .toDateString()
              .toLowerCase()
              .replace(new RegExp(" ", "g"), "-");

        return obj[dateKey]
          ? { ...obj, [dateKey]: [...obj[dateKey], message] }
          : { ...obj, [dateKey]: [message] };
      },
      {}
    );

    return messagesByDate;
  }

  /**
   * Checks if message date is from the current Date/time
   *
   * @param {} messageDate
   * @returns boolean
   */
  fromToday(messageDate) {
    const today = new Date();
    return today.toDateString() === messageDate.toDateString();
  }

  /**
   * Instantly scroll to the bottom of the ChatWindow
   *
   */
  scrollToBottomOfChat() {
    this.messageListBottom.scrollIntoView({ behavior: "instant" });
  }

  renderMessageGroup(dateGroup) {
    const { users } = this.props;

    return dateGroup.map((message, index) => {
      const timeStamp = new Date(message.created).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
      const user = users[message.user];

      return (
        <List.Item key={message.id} className="room-message">
          <List.Content>
            <UserBadge user={user} />
            <div className="room-message-content">
              <span className="room-message-username">{user.name}</span>
              <span className="room-message-timestamp">{timeStamp}</span>
              <div className="room-message-text">{message.value}</div>
            </div>
          </List.Content>
        </List.Item>
      );
    });
  }

  render() {
    const { users, messages } = this.props;
    const messagesByDate = this.groupMessagesByDate(messages);

    return (
      <div>
        <div id="chat-window">
          <List id="messages">
            {Object.keys(messagesByDate).map((dateGroup, index) => {
              return (
                <React.Fragment key={dateGroup}>
                  <Divider horizontal>{dateGroup}</Divider>
                  {this.renderMessageGroup(messagesByDate[dateGroup])}
                </React.Fragment>
              );
            })}
            <div ref={el => (this.messageListBottom = el)} />
          </List>
          <ChatMessageInput
            socket={this.props.socket}
            activeRoom={this.props.activeRoom}
            currentUser={this.props.currentUser}
            addMessageToRoom={this.props.addMessageToRoom}
          />
        </div>
      </div>
    );
  }
}

export default ChatWindow;
