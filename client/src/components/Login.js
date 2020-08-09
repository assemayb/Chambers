import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { authLogin } from "../store/actions/auth";
import { Redirect } from "react-router-dom";

const LoginForm = ({ token, login, error}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const loginUser = () => {
    if (username && password) {
      login(username, password);
    } else {
      setErr("Enter Valid Data");
      setTimeout(() => {
        setErr("");
      }, 2000);
    }
  };

  if (token) {
    return <Redirect to="/" />;
  } else {
    return (
      <Grid
        textAlign="center"
        style={{ height: "69vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header
            as="h3"
            color="blue"
            textAlign="center"
            style={{ marginBottom: "3rem" }}
          >
            Login to your account
          </Header>
          <Form size="big" inverted onSubmit={loginUser}>
            {err && <h6>{err}</h6>}
            <Segment>
              <Form.Input
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="username"
              />
              <Form.Input
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />

              <Button color="blue" fluid size="small">
                Login
              </Button>
            </Segment>
          </Form>
          <Segment>
            New to us ? <a href="/signup">sign up here</a>
          </Segment>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(authLogin(username, password)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
