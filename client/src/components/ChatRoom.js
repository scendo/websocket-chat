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
import { openChatRoom } from "../actions/chat";
import Navbar from "./Navbar";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

class Chatroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentDidMount() {
    if (!this.props.socket) {
      const socket = this.initSocket();
    }
  }

  initSocket() {
    const socket = io("http://localhost:7777");

    socket.on("connect", () => {
      socket.emit(
        "CHAT_SERVICE_START",
        { currentUserId: this.props.auth.user.id },
        response => {
          const options = { socket, ...response.data };
          console.log(response, options);
          this.props.openChatRoom(options);
        }
      );
    });

    return socket;
  }

  handleMenuClick() {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  render() {
    const { menuVisible } = this.state;

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
            <ChatSidebar />
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <ChatHeader />
              <ChatWindow />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { openChatRoom })(Chatroom);
