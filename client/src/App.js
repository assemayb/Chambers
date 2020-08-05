import React, { useState, useEffect, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import BaseRouter from "./routes";
import { authLogin } from "./store/actions/auth";
import { connect } from "react-redux";
import BaseMenu from "./components/Menu";
import Footer from "./components/Footer";

import { authCheckState } from "./store/actions/auth";

function App(props) {
  // if (props.token) {
    // const halfHour = 30 * 1000
  //   setInterval(() => props.checkState(), 1000);
  // }
  // setInterval(() => props.checkState(), 1000);
  const hours = new Date().getHours() * 60 * 60 * 1000
  const mins = new Date().getMinutes() * 60 * 1000
  const secs = new Date().getSeconds() * 1000

  const all  = (hours + mins + secs )
  const d = new Date().getTime()
  const isEqual = all === d

  // console.log(all)
  // console.log(d)

  props.checkState()
  console.log(props.isLoggedIn)

  return (
    <Fragment>
      <Router>
        <BaseMenu />
        <BaseRouter />)
        <Footer />
      </Router>
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    isLoggedIn: state.auth.token !== null
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(authLogin(username, password)),
    checkState: () => dispatch(authCheckState()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
