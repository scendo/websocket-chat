import React, { Component } from "react";
import { Input, Button, Header, List, Icon } from "semantic-ui-react";

class DirectMessageSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      matchedUsers: this.getMatchedUsers(props.users, "")
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  getMatchedUsers(users, inputValue) {
    const upperCaseInputValue = inputValue.toUpperCase();

    return Object.values(users).filter((user, index) => {
      if (user.name.toUpperCase().indexOf(upperCaseInputValue) !== -1)
        return user;
    });
  }

  handleInputChange(e) {
    const { users } = this.props;
    const inputValue = e.target.value;

    this.setState({
      inputValue,
      matchedUsers: this.getMatchedUsers(users, inputValue)
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
          action="Go"
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
