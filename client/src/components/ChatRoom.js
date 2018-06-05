import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import {
  Sidebar,
  Segment,
  Menu,
  Icon,
  Image,
  Header,
  Form,
  Grid
} from "semantic-ui-react";
import soa from "../utils/socketActions";
import {
  openChatRoom,
  addRoom,
  addMessageToRoom,
  addUnreadMessage
} from "../actions/chat";
import { logoutUser } from "../actions/auth";
import Navbar from "./Navbar";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import CreateChannel from "./CreateChannel";
import DirectMessageSearch from "./DirectMessageSearch";

/**
 * Chatroom is the main smart component for the application.
 *
 * Responsbilities:
 *
 *  - create the socket connection between the client and the server
 *  - handle all socket events emitted from the server socket
 *  - renders the chat app's other components: ChatHeader, ChatSidebar, ChatWindow, CreateChannel etc.
 *
 */
class Chatroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createChannel: false,
      addDirectMessage: false,
      menuVisible: false
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleCreateChannelClick = this.handleCreateChannelClick.bind(this);
    this.handleAddDirectMessageClick = this.handleAddDirectMessageClick.bind(
      this
    );
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.showRoom = this.showRoom.bind(this);
    this.setMenuVisibility = this.setMenuVisibility.bind(this);
  }

  componentDidMount() {
    if (!this.props.socket) {
      const socket = this.initSocket();
      this.initSocketEvents(socket);
    } else {
      this.initSocketEvents(this.props.socket);
    }
  }

  /**
   * Initialize the  client/server socket connection
   */
  initSocket() {
    const socket = io("http://localhost:7777");

    socket.on("connect", () => {
      soa.startChatService(
        { socket, currentUserId: this.props.auth.user.id },
        options => {
          this.props.openChatRoom(options);
        }
      );
    });

    return socket;
  }

  /**
   * Initialize socket events to accept emit's from the server socket
   */
  initSocketEvents(socket) {
    if (socket) {
      socket.on("MESSAGE_ADDED", ({ userId, room, message }) => {
        const { currentUser, activeRoom } = this.props;

        //If client's actively in the room of the sent message, then add it to the current room
        if (activeRoom.id === room.id) {
          this.props.addMessageToRoom({ room, message });
        } else if (currentUser.rooms.includes(room.id)) {
          this.props.addUnreadMessage({
            room,
            currentUser
          });
          soa.addUnreadMessage({ socket, userId: currentUser.id, room });
        } else {
        }
      });

      /**
       * A room was created.
       *
       * If the current user is in the room, add the room to the client's store so that the client
       * can access the room without refreshing the browser
       */
      socket.on("ROOM_CREATED", ({ room }) => {
        const { currentUser } = this.props;
        if (room.users.includes(currentUser.id)) {
          this.props.addRoom(room);
        }
      });
    }
  }

  /**
   * Toggle the menu visibility on click
   */
  handleMenuClick() {
    this.setMenuVisibility(!this.state.menuVisible);
  }

  /**
   * Render the Createchannel component on (+) click in the sidebar
   *
   * @param {*} e
   */
  handleCreateChannelClick(e) {
    this.setState({
      createChannel: true
    });
  }

  /**
   * Render the DirectMessageSearch component on (+) click in the sidebar
   *
   * @param {*} e
   */
  handleAddDirectMessageClick(e) {
    this.setState({
      addDirectMessage: true
    });
  }

  /**
   * Logs the user out, clearing all user specific data in the redux store
   *
   * Disconnect the socket
   *
   * @param {*} e
   */
  handleLogoutClick(e) {
    e.preventDefault();

    const { socket } = this.props;

    this.props.logoutUser();
    socket.disconnect();
  }

  /**
   * Used to exit one of the setting Components and renders the chatroom instead
   * ie: CreateChannel
   */
  showRoom() {
    this.setState({
      createChannel: false,
      addDirectMessage: false
    });
  }

  /**
   * Set the visibility of the menu
   *
   * (boolean) visible
   */
  setMenuVisibility(visible) {
    this.setState({
      menuVisible: visible
    });
  }

  render() {
    const { menuVisible } = this.state;
    const { currentUser, activeRoom, users, messages, rooms } = this.props;

    if (this.state.createChannel) {
      return (
        <CreateChannel
          {...this.props}
          showRoom={this.showRoom}
          setMenuVisibility={this.setMenuVisibility}
        />
      );
    }

    if (this.state.addDirectMessage) {
      return (
        <DirectMessageSearch
          {...this.props}
          showRoom={this.showRoom}
          setMenuVisibility={this.setMenuVisibility}
        />
      );
    }

    return (
      <div id="chatroom">
        <Navbar
          currentUser={currentUser}
          activeRoom={this.props.activeRoom}
          handleMenuClick={this.handleMenuClick}
          handleLogoutClick={this.handleLogoutClick}
        />
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            id="chat-sidebar"
            direction="left"
            as={Menu}
            animation="overlay"
            width="wide"
            visible={menuVisible}
            icon="labeled"
            vertical
          >
            <ChatSidebar
              socket={this.props.socket}
              currentUser={this.props.currentUser}
              users={this.props.users}
              rooms={this.props.rooms}
              openChatRoom={this.props.openChatRoom}
              setMenuVisibility={this.setMenuVisibility}
              handleCreateChannelClick={this.handleCreateChannelClick}
              handleAddDirectMessageClick={this.handleAddDirectMessageClick}
            />
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <ChatWindow {...this.props} />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  currentUser: state.currentUser,
  socket: state.socket,
  users: state.users,
  rooms: state.rooms,
  activeRoom: state.activeRoom,
  messages: state.messages
});

export default connect(
  mapStateToProps,
  {
    openChatRoom,
    addRoom,
    addMessageToRoom,
    addUnreadMessage,
    logoutUser
  }
)(Chatroom);
