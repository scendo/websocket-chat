import React, { Component } from "react";
import { connect } from "react-redux";
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
import Navbar from "./Navbar";
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
              <h1>Chatroom</h1>
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

export default connect(mapStateToProps, {})(Chatroom);
