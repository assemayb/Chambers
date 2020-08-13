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

  if (props.isAuthenticated) {
    props.checkState();
  }
  const halfAnHour = 15 * 1000 * 60;
  setInterval(() => props.checkState(), halfAnHour);
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
  let tokens = []
  const access = localStorage.getItem("accessToken")
  const refresh = localStorage.getItem("refreshToken")

  return {
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    storageHasTokens: access != null && refresh != null
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkState: () => dispatch(authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
