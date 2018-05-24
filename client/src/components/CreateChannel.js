import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Header,
  List,
  Icon,
  Dropdown
} from "semantic-ui-react";

class CreateChannel extends Component {
  constructor(props) {
    super(props);
    /**
     * remove current user from users
     *
     *  - Using a combination of descructuring and spread operator to maintain immutability while deleting an objects key
     *  - deconstructing props.user.id as currentUser
     *  - spreading the remaining key/values as remainingUsers
     *
     */
    const {
      [props.auth.user.id]: currentUser,
      ...remainingUsers
    } = props.users;

    console.log(props, remainingUsers);

    this.state = {
      nameInput: "",
      selectedUsers: [],
      userDropdownOptions: this.getUserDropdownOptions(remainingUsers)
    };
  }

  /**
   * Formats the users object into an array of users to work with <Dropdown /> options
   */
  getUserDropdownOptions(users) {
    return Object.values(users).reduce((array, user) => {
      return [
        ...array,
        {
          key: user.id,
          text: user.name,
          value: user.id,
          content: (
            <React.Fragment>
              <Icon
                color={user.socketId ? "green" : null}
                name={user.socketId ? "circle" : "circle outline"}
              />
              {user.name}
            </React.Fragment>
          )
        }
      ];
    }, []);
  }

  render() {
    return (
      <div id="chat-create-channel">
        <Header as="h2" content="Create Channel" />
        <Button
          className="escape-chat-menu-btn"
          icon="remove"
          floated="right"
          size="big"
        />
        <Form>
          <Form.Field>
            <label>Name</label>
            <input placeholder="# e.g. leads" />
          </Form.Field>

          <Form.Field>
            <label>Send Invites to: (optional)</label>
            <Form.Dropdown
              placeholder="Search by name"
              fluid
              multiple
              search
              selection
              options={this.state.userDropdownOptions}
            />
          </Form.Field>
          <Button type="submit">Cancel</Button>
          <Button type="submit">Create Channel</Button>
        </Form>
      </div>
    );
  }
}

export default CreateChannel;
