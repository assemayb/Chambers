import React, { useState, useEffect } from "react";
import {
  Segment,
  Container,
  Grid,
  Header,
  List,
  Divider,
  Dimmer,
  Loader,
  Image,
} from "semantic-ui-react";
import axios from "axios";
import { roomsURL } from "../constants";
import { Link, withRouter, Redirect, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { prettifyLocation } from "../utils";

function MainLayout(props) {
  // const [allRooms, setAllRooms] = useState([]);
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ visible: "Hide", value: "" });

  const isLoggedIn = props.isLoggedIn;
  useEffect(() => {
    const getData = () => {
      axios
        .get(roomsURL)
        .then((res) => {
          let arr = res.data;
          console.log(arr);
          // setAllRooms=(arr)
          let middle = Math.floor(arr.length / 2);
          let x = arr.slice(0, middle);
          let y = arr.slice(middle, arr.length);
          setLoading(false);
          setArray1(x);
          setArray2(y);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getData();
  }, []);

  const enterSingleRoom = (title) => {
    if (isLoggedIn) {
      const newTitle = prettifyLocation(title);
      props.history.push(`/rooms/${newTitle}`);
    } else {
      window.scrollTo(0, 50);
      setMessage({
        visible: "Show",
        value: `${title} is private a room!`,
      });
      setTimeout(() => {
        setMessage({ visible: "Hide", value: "" });
      }, 4000);
    }
  };

  if (loading) {
    return (
      <>
        <Segment style={{ height: "100vh" }}>
          <Dimmer active inverted>
            <Loader size="large" inverted content="Loading.." />
          </Dimmer>
        </Segment>
      </>
    );
  } else {
    return (
      <Container text style={styles.container}>
        {message.value ? (
          <Header as="h1" style={{ paddingBottom: "3rem" }}>
            {message.value}
          </Header>
        ) : (
          <Header as="h1" style={{ paddingBottom: "3rem" }}>
            The Available Rooms
          </Header>
        )}
        <Divider />
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <List divided relaxed>
                {array2.map((room, id) => {
                  return (
                    <Container style={styles.room}>
                      <List.Item
                        key={id}
                        style={styles.item}
                        onClick={() => enterSingleRoom(room.title)}
                      >
                        <List.Content>
                          <List.Header as="h2">
                            <Link
                              style={{
                                color: "#1E70BF",
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                              onClick={() => enterSingleRoom(room.title)}
                            >
                              {" "}
                              {room.title}{" "}
                            </Link>
                          </List.Header>
                          <List.Icon
                            name="box"
                            size="large"
                            verticalAlign="middle"
                          />
                          <List.Description as="h6">
                            created by: {room.admin.name}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </Container>
                  );
                })}
              </List>
            </Grid.Column>
            <Grid.Column>
              <List divided relaxed>
                {array1.map((room, id) => {
                  return (
                    <Container style={styles.room}>
                      <List.Item
                        key={id}
                        style={styles.item}
                        onClick={() => enterSingleRoom(room.title)}
                      >
                        <List.Content>
                          <List.Header as="h2">
                            <Link
                              style={{
                                color: "#1E70BF",
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                              onClick={() => enterSingleRoom(room.title)}
                            >
                              {room.title}
                            </Link>
                          </List.Header>
                          <List.Icon
                            name="box"
                            size="large"
                            verticalAlign="middle"
                          />
                          <List.Description as="h6">
                            created by: {room.admin.name}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </Container>
                  );
                })}
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const styles = {
  container: {
    marginTop: "5rem",
    textAlign: "center",
  },
  room: {
    padding: "1rem",
    marginLeft: "1rem",
  },
  item: {
    backgroundColor: "#F2F2F2",
    padding: "1rem",
    borderRadius: "40px",
  },
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.token !== null,
  };
};

export default withRouter(connect(mapStateToProps)(MainLayout));
