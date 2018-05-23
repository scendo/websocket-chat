import React, { Component } from "react";
import { Form } from "semantic-ui-react";
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

      this.setState({
        input: ""
      });
    }
  }

  render() {
    return (
      <div>
        <div id="chat-window" />
        <div>
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
      </div>
    );
  }
}

export default ChatWindow;
