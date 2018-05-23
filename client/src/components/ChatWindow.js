import React, { Component } from "react";
import { Form } from "semantic-ui-react";
class ChatWindow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div id="chat-window" />
        <div>
          <Form.Input id="m" name="message" autoComplete="off" fluid />
        </div>
      </div>
    );
  }
}

export default ChatWindow;
