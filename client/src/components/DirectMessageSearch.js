import React, { Component } from "react";
import { Input, Button, Header, List, Icon } from "semantic-ui-react";

class DirectMessagesSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: ""
    };
  }

  render() {
    return (
      <div id="chat-add-direct-message">
        <Header as="h2" content="Direct Messages" />
      </div>
    );
  }
}

export default DirectMessagesSearch;
