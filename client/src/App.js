import React, { useState, useEffect, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import BaseRouter from "./routes";
import { authLogin } from "./store/actions/auth";
import { connect } from "react-redux";
import BaseMenu from "./components/Menu";
import Footer from "./components/Footer";
import { authCheckState } from "./store/actions/auth";

function App({ checkState, refTokenExist }) {
  if (refTokenExist) {
    checkState();
  }
  const quarter = 15 * 1000 * 60;
  setInterval(() => checkState(), quarter);

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
  const refToken = localStorage.getItem('refreshToken')
  return {
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    refTokenExist: refToken !== null
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkState: () => dispatch(authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
