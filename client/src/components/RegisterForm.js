import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Message
} from "semantic-ui-react";
import { registerUser } from "../actions/auth";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordconfirm: "",
      errors: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps, prevState) {
    console.log(nextProps);
    if (
      nextProps.errors.type !== undefined &&
      nextProps.errors.type === "register"
    ) {
      const errors = nextProps.errors.data.reduce((arr, error) => {
        return [...arr, error.msg];
      }, []);

      this.setState({ errors });
    }
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordconfirm: this.state.passwordconfirm
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    return (
      <div className="register-form">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              {" "}
              Register
            </Header>
            <Message
              hidden={!this.state.errors.length > 0 ? true : false}
              error
              header="There was an error with your submission"
              list={this.state.errors}
            />
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  name="name"
                  onChange={this.handleInputChange}
                  value={this.state.name}
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Name"
                />
                <Form.Input
                  name="email"
                  onChange={this.handleInputChange}
                  value={this.state.email}
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="E-mail address"
                />
                <Form.Input
                  name="password"
                  onChange={this.handleInputChange}
                  value={this.state.password}
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />
                <Form.Input
                  name="passwordconfirm"
                  onChange={this.handleInputChange}
                  value={this.state.passwordconfirm}
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Confirm Password"
                  type="password"
                />
                <Button
                  color="teal"
                  fluid
                  size="large"
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(RegisterForm);
