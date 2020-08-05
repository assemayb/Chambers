import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authSignUp } from "../store/actions/auth";

const RegistrationForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = props.token;
  const signupSubmit = () => {
    if (username && password) {
      props.signup(username, password);
      const msg = localStorage.getItem('msg')
      const status = localStorage.getItem('status')

      setTimeout(() => {
        if (!msg) {
          return ;
        } else {
          if (status === "201") {
            setLoading(true);
            setMessage("User Created, Redirecting to login page.....");
            setTimeout(() => {
              props.history.push("/login");
            }, 3000);
          } else if (status === "400") {
            setMessage(msg);
          }
        }
      }, 1000);
      localStorage.removeItem('msg')
      localStorage.removeItem('status')

    } else {
      setMessage("Invalid data");
    }
  };

  if (token) {
    return <Redirect to="/" />;
  } else if (!token) {
    return (
      <Grid
        textAlign="center"
        style={{ height: "69vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h3" color="blue" textAlign="center">
            create an account
          </Header>
          {loading && <Loader active />}
          {message && <h4>{message}</h4>}
          <React.Fragment>
            <Form size="big" inverted onSubmit={signupSubmit}>
              <Segment>
                <Form.Input
                  onChange={(e) => setUsername(e.target.value)}
                  name="username"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                />
                <Form.Input
                  onChange={(e) => setPassword(e.target.value)}
                  fluid
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />

                <Button color="blue" fluid size="small">
                  Sign Up
                </Button>
              </Segment>
            </Form>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token,
    info: state.auth.info,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (username, password) => dispatch(authSignUp(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
