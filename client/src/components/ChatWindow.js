import React, { Component } from "react";
import { List, Form, Divider } from "semantic-ui-react";
class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
  }

  componentDidMount() {
    this.scrollToBottomOfChat();
  }

  componentDidUpdate() {
    this.scrollToBottomOfChat();
  }

  onInputChange(e) {
    this.setState({ input: e.target.value });
  }

  handleMessageSubmit(e) {
    if (this.state.input.length > 0 && e.key === "Enter") {
      e.preventDefault();

      const { socket, activeRoom, currentUser, addMessageToRoom } = this.props;

      socket.emit(
        "MESSAGE_ADD",
        {
          room: activeRoom,
          userId: currentUser.id,
          input: this.state.input
        },
        response => {
          if (response.success) {
            const { room, message } = response.data;
            addMessageToRoom({ room, message });
          }
        }
      );

      this.setState({
        input: ""
      });
    }
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
      return (
        <List.Item key={message.id} className="room-message">
          <List.Header>
            <span className="room-message-username">
              {users[message.user].name}
            </span>
            <span className="room-message-timestamp">{timeStamp}</span>
          </List.Header>
          <List.Content>{message.value}</List.Content>
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
        </div>
        <Form.Input
          id="m"
          name="message"
          autoComplete="off"
          fluid
          onChange={this.onInputChange}
          onKeyPress={this.handleMessageSubmit}
          value={this.state.input}
        />
      </div>
    );
  }
}

export default ChatWindow;
