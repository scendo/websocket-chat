import React, { Component } from "react";
import { List, Form } from "semantic-ui-react";
class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
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
            addMessageToRoom(room, message);
          }
        }
      );

      this.setState({
        input: ""
      });
    }
  }

  render() {
    const { users, messages } = this.props;

    return (
      <div>
        <div id="chat-window">
          <List id="messages">
            {Object.values(messages).map((message, index) => {
              const timeStamp = new Date(message.created).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit"
                }
              );

              return (
                <React.Fragment key={message.id}>
                  <List.Item key={message.id} className="room-message">
                    <List.Header>
                      <span className="room-message-username">
                        {users[message.user].name}
                      </span>
                      <span className="room-message-timestamp">
                        {timeStamp}
                      </span>
                    </List.Header>
                    <List.Content>{message.value}</List.Content>
                  </List.Item>
                </React.Fragment>
              );
            })}
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
