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
import soa from "../utils/socketActions";

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

    this.state = {
      nameInput: "",
      selectedUsers: [],
      userDropdownOptions: this.getUserDropdownOptions(remainingUsers)
    };

    this.handleNameInputChange = this.handleNameInputChange.bind(this);
    this.handleUserSelection = this.handleUserSelection.bind(this);
    this.handleLabelClick = this.handleLabelClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Update create channel name input field in state
   */
  handleNameInputChange(e) {
    const { value } = e.target;
    if (value.length > 0) {
      this.setState({
        nameInput: e.target.value
      });
    }
  }

  /**
   * Udpate selectedUsers
   */
  handleUserSelection(e, data) {
    this.setState({
      selectedUsers: data.value
    });
  }

  /**
   * Remove user from selecteUsers on Dropdown Label click
   */
  handleLabelClick(e, data) {
    const selectedUsers = this.state.selectedUsers.filter(
      (userId, index) => userId !== data.value
    );
    this.setState({
      selectedUsers
    });
  }

  handleSubmit(e) {
    const {
      socket,
      showRoom,
      addRoom,
      openChatRoom,
      setMenuVisibility
    } = this.props;

    soa.createRoom(
      {
        socket,
        group: "channel",
        name: this.state.nameInput,
        users: [this.props.currentUser.id, ...this.state.selectedUsers]
      },
      response => {
        if (response.success) {
          const { room, messages } = response.data;

          setMenuVisibility(false);

          addRoom(room);

          openChatRoom({
            room,
            messages
          });

          showRoom();
        }
      }
    );
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
          onClick={this.props.showRoom}
        />
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input
              placeholder="# e.g. leads"
              onChange={this.handleNameInputChange}
            />
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
              onChange={this.handleUserSelection}
              onLabelClick={this.handleLabelClick}
              value={this.state.selectedUsers}
            />
          </Form.Field>
          <Button type="submit" onClick={this.props.showRoom}>
            Cancel
          </Button>
          <Button type="submit">Create Channel</Button>
        </Form>
      </div>
    );
  }
}

export default CreateChannel;
