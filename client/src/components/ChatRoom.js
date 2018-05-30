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
import { openChatRoom, addRoom, addMessageToRoom } from "../actions/chat";
import Navbar from "./Navbar";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import CreateChannel from "./CreateChannel";
import DirectMessageSearch from "./DirectMessageSearch";

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
      const { currentUser } = this.props;

      socket.on("MESSAGE_ADDED", ({ userId, room, message }) => {
        //If client's actively in the room of the sent message, then add it to the current room
        if (this.props.activeRoom.id === room.id) {
          this.props.addMessageToRoom(room, message);
        }
      });

      /**
       * A room was created.
       *
       * If the current user is in the room, add the room to the client's store so that the client
       * can access the room without refreshing the browser
       */
      socket.on("ROOM_CREATED", ({ room }) => {
        if (room.users.includes(currentUser.id)) {
          this.props.addRoom(room);
        }
      });
    }
  }

  handleMenuClick() {
    this.setMenuVisibility(!this.state.menuVisible);
  }

  handleCreateChannelClick(e) {
    this.setState({
      createChannel: true
    });
  }

  handleAddDirectMessageClick(e) {
    this.setState({
      addDirectMessage: true
    });
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
        <Navbar handleMenuClick={this.handleMenuClick} />
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
              {...this.props}
              setMenuVisibility={this.setMenuVisibility}
              handleCreateChannelClick={this.handleCreateChannelClick}
              handleAddDirectMessageClick={this.handleAddDirectMessageClick}
            />
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <ChatHeader activeRoom={activeRoom} />
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
  currentUser: state.auth.user,
  socket: state.socket,
  users: state.users,
  rooms: state.rooms,
  activeRoom: state.activeRoom,
  messages: state.messages
});

export default connect(mapStateToProps, {
  openChatRoom,
  addRoom,
  addMessageToRoom
})(Chatroom);
