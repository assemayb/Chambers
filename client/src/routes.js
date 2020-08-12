import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Room from "./components/Room";
import MainLayout from "./components/MainLayout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import SingleRoom from "./components/SingleRoom";
import UserProfile from "./components/UserProfile";

const BaseRouter = () => (
  <Switch>
    <Route exact path="/" component={MainLayout} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/signup" component={SignUp} />
    <Route path="/allrooms" component={Room} />
    <Route path="/rooms/:roomName" component={SingleRoom} />
    <Route path="/profile" component={UserProfile} />
    {/* Profile */}
  </Switch>
);

export default BaseRouter;
