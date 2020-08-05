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
    <Menu size="big" color="blue" style={styles.menu}>
      <Link to="/">
        <Menu.Item
          style={{ padding: "1.5rem", height: '100%', width: '100%'}}
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
          style={{ padding: "1.5rem" }}
          icon="table"
          name="chambers"
          active={activeItem === "chambers"}
          onClick={handleItemClick}
        />
      </Link>
      <Link to="/">
        <Menu.Item
          style={{ padding: "1.5rem" }}
          icon="table"
          name="public"
          active={activeItem === "public"}
          onClick={handleItemClick}
        />
      </Link>
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
  menu: {
    paddingLeft: "6rem",
    paddingRight: "6rem",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    
  },
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
