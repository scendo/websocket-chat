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
import { openChatRoom, addMessageToRoom } from "../actions/chat";
import Navbar from "./Navbar";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import CreateChannel from "./CreateChannel";

class Chatroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createChannel: false,
      menuVisible: false
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleCreateChannelClick = this.handleCreateChannelClick.bind(this);
    this.showRoom = this.showRoom.bind(this);
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
      socket.emit(
        "CHAT_SERVICE_START",
        { currentUserId: this.props.auth.user.id },
        response => {
          const options = { socket, ...response.data };

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
        const { activeRoom } = this.props;

        //If client's actively in the room of the sent message, then add it to the current room
        if (activeRoom.id === room.id) {
          this.props.addMessageToRoom(room, message);
        }
      });
    }
  }

  handleMenuClick() {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  handleCreateChannelClick(e) {
    this.setState({
      createChannel: true
    });
  }

  /**
   * Used to exit one of the setting Components and renders the chatroom instead
   * ie: CreateChannel
   */
  showRoom() {
    this.setState({
      createChannel: false
    });
  }

  render() {
    const { menuVisible } = this.state;
    const { currentUser, activeRoom, users, messages, rooms } = this.props;

    if (this.state.createChannel) {
      return <CreateChannel {...this.props} showRoom={this.showRoom} />;
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
              handleCreateChannelClick={this.handleCreateChannelClick}
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

export default connect(mapStateToProps, { openChatRoom, addMessageToRoom })(
  Chatroom
);
