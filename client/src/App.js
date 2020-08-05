import React, { useState, useEffect, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import BaseRouter from "./routes";
import { authLogin } from "./store/actions/auth";
import { connect } from "react-redux";
import BaseMenu from "./components/Menu";
import Footer from "./components/Footer";

import {authCheckState} from "./store/actions/auth"

function App(props) {
  props.checkState()
  return (
    <Fragment>
      <Router>
        <BaseMenu />
        <BaseRouter />
        <Footer />
      </Router>
    </Fragment>
  );
}

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
    checkState: () => dispatch(authCheckState())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
