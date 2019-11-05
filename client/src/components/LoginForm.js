import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Form,
  Grid,
  Message,
  Segment
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import Page from "./Page";
import Brand from "./Brand";
import { loginUser } from "../actions/auth";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    //redirect the user to the chatroom if the user logged in successfully
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/chatroom");
    }
  }

  componentWillReceiveProps(nextProps, prevState) {
    //set the login errors in state if found in the redux store
    if (
      nextProps.errors.type !== undefined &&
      nextProps.errors.type === "login"
    ) {
      //Format the errors into an array to work with Message component
      const errors = nextProps.errors.data.reduce((arr, error) => {
        return [...arr, error.msg];
      }, []);

      this.setState({ errors });
    }
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/chatroom");
    }
  }

  handleInputChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
      errors: []
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;

    this.props.loginUser(email, password);
  }

  render() {
    return (
      <Page>
        <div id="login-form">
          <Grid
            textAlign="center"
            style={{ height: "100%" }}
            verticalAlign="middle"
          >
            <Grid.Column>
              <Brand />
              <Message
                hidden={!this.state.errors.length > 0 ? true : false}
                error
                header="There was an error with your submission"
                list={this.state.errors}
              />
              <Form size="large">
                <Segment stacked>
                  <Form.Input
                    name="email"
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="E-mail address"
                    onChange={this.handleInputChange}
                    value={this.state.email}
                  />
                  <Form.Input
                    name="password"
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    onChange={this.handleInputChange}
                    value={this.state.password}
                  />
                  <Button
                    className="submit-btn"
                    fluid
                    size="large"
                    onClick={this.handleSubmit}
                  >
                    LOGIN
                  </Button>
                </Segment>
              </Form>
              <Message>
                New to us? <Link to="/signup">Sign Up</Link>
              </Message>
            </Grid.Column>
          </Grid>
        </div>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(LoginForm);
