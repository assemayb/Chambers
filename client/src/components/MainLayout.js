import React, { useState, useEffect, useRef } from "react";
import {
  Segment,
  Container,
  Grid,
  Header,
  List,
  ListContent,
  Divider,
  Image,
  Column,
  Row,
  Form,
  Button,
  Checkbox,
} from "semantic-ui-react";
import axios from "axios";

import { roomsURL } from "../constants";
import { connect } from "react-redux";
import { authAxios } from "../utils";

function MainLayout(props) {
  const [questions, setQuestions] = useState(["1"]);
  const [userRooms, setUserRooms] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);

  const isLoggedIn = props.isLoggedIn;

  useEffect(() => {
    const getUserRooms = () => {
      const admin = props.currentLoggedUser;
      // axios
      //   .get(`${roomsURL}/user-rooms/${admin}`)
      //   .then((res) => {
      //     console.log(res.data);
      //     setUserRooms(res.data);
      //   })
      authAxios
        .get(`${roomsURL}/user-rooms`)
        .then((res) => {
          console.log(res.data);
          setUserRooms(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getUserRooms();
  }, []);
  const enterSingleRoom = (title) => {
    let roomtitle = title.split(" ");
    let newTitle = "";
    if (roomtitle.length === 1) {
      newTitle = roomtitle[0];
    } else {
      let arrLength = roomtitle.length;
      for (let i = 0; i < arrLength - 1; i++) {
        newTitle += roomtitle[i] += "_";
      }
      newTitle += roomtitle[arrLength - 1];
    }
    props.history.push(`/rooms/${newTitle}`);
  };

  return (
    <Container style={styles.container}>
      {isLoggedIn ? (
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={6}>
              <Segment style={{ backgroundColor: "#f9f9f9" }}>
                <Header>Create new rooms</Header>
              </Segment>
              <Segment>
                <Form id="questionsForm">
                  <Form.Field>
                    <label>room title</label>
                    <input placeholder="enter a title..." />
                  </Form.Field>
                  {questions.map((ques) => (
                    <Form.Field key={ques.id}>
                      <label>add a question</label>
                      <input placeholder="enter a question.." />
                    </Form.Field>
                  ))}
                  <div>
                    <Button compact type="submit">
                      create
                    </Button>
                  </div>
                </Form>
              </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
              <Segment style={{ backgroundColor: "#f9f9f9" }}>
                <h3>Manage your rooms</h3>
              </Segment>
              <Segment>
                {userRooms.map((room) => (
                  <Segment
                    key={room.id}
                    width={4}
                    style={{ cursor: "pointer" }}
                    onClick={() => enterSingleRoom(room.title)}
                  >
                    <Header as="a">{room.title}</Header>
                  </Segment>
                ))}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      ) : (
        <Grid columns={3} divided>
          <Grid.Row>
            <Grid.Column style={styles.column}>
              <Container>
                <h2>Create different rooms with specific topics</h2>
              </Container>
            </Grid.Column>
            <Grid.Column style={styles.column}>
              <Container>
                <h2>Answer question at each rooms, edit or even delete them</h2>
              </Container>
            </Grid.Column>

            <Grid.Column style={styles.column}>
              <h3>
                Login in <a href="/login">here</a>
              </h3>
              <Divider />
              <h3>
                create an account <a href="/signup">here</a>
              </h3>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </Container>
  );
}

const styles = {
  container: {
    margin: "5rem",
    textAlign: "center",
    padding: "8rem",
    height: "58vh",
  },
  column: {
    wdith: "33.3%",
  },
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(MainLayout);
