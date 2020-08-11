import React, { Component, useState } from "react";
import { Button, Dropdown, Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { authLogout } from "../store/actions/auth";

const BaseMenu = (props) => {
  const [activeItem, setActiveItem] = useState("home");
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const token = props.token;

  return (
    <Menu size="large" color="blue" style={styles.menu}>
      <Link to="/">
        <Menu.Item
          style={{ height: '100%', width: '100%'}}
          name="home"
          active={activeItem === "home"}
          onClick={handleItemClick}
        >
          <Icon name="home" />
          home
        </Menu.Item>
      </Link>
      <Link to="/allrooms">
        <Menu.Item
          style={{ height: '100%', width: '100%'}}
          icon="table"
          name="chambers"
          active={activeItem === "chambers"}
          onClick={handleItemClick}
        />
      </Link>
      {/* <Link to="/">
        <Menu.Item
          style={{ height: '100%', width: '100%'}}
          icon="table"
          name="public"
          active={activeItem === "public"}
          onClick={handleItemClick}
        />
      </Link> */}
      <Menu.Menu position="right">
        <Menu.Item
          name="profile"
          icon="user circle"
          active={activeItem === "profile"}
          onClick={handleItemClick}
        />
        <Link to="/login">
          <Menu.Item>
            {token ? (
              <Button onClick={props.logout}color="red">Log out</Button>
            ) : (
              <Button color="blue">Log in</Button>
            )}
          </Menu.Item>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

const styles = {
  // menu: {
  //  height: '7vh'
  // },
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(authLogout())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BaseMenu);
