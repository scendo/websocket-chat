import React, { Component } from "react";
import { Form } from "semantic-ui-react";

class ChatMessageInput extends Component {
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
            addMessageToRoom({ room, message });
          }
        }
      );

      this.setState({
        input: ""
      });
    }
  }

  render() {
    const { activeRoom } = this.props;
    const roomNamePrefix = activeRoom.group === "channel" ? "#" : "@";
    return (
      <div id="room-message-input">
        <Form.Input
          name="message"
          autoComplete="off"
          placeholder={`Message ${roomNamePrefix} ${activeRoom.name}`}
          fluid
          onChange={this.onInputChange}
          onKeyPress={this.handleMessageSubmit}
          value={this.state.input}
        />
      </div>
    );
  }
}

export default ChatMessageInput;
