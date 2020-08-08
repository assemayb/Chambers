import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Segment,
  Container,
  Grid,
  Header,
  Divider,
  Row,
  Form,
  Button,
  Loader,
  List
} from "semantic-ui-react";
import axios from "axios";
import { roomsURL } from "../constants";
import { connect } from "react-redux";
import { authAxios } from "../utils";

function MainLayout(props) {
  const [questions, setQuestions] = useState(["1"]);
  const [userRooms, setUserRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = props.isLoggedIn;
  const admin = props.currentLoggedUser;

  useEffect(() => {
    const getUserRooms = () => {
      authAxios
        .get(`${roomsURL}/user-rooms`)
        .then((res) => {
          setUserRooms(res.data);
          setTimeout(() => {
            setLoading(false);
          }, 100);
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
  let arr = [];
  for (let x = 0; x < 100; x++) {
    arr.push(x);
  }

  return (
    <Container style={styles.container}>
      {isLoggedIn ? (
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={6}>
              <Segment
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px 10px",
                }}
              >
                <h1>Create new rooms</h1>
              </Segment>
              <Segment
                style={{
                  backgroundColor: "#f9f9f9",
                }}
              >
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
              <Segment
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px 10px",
                }}
              >
                <h1>Manage your rooms</h1>
              </Segment>
              <Segment
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                {loading && (
                  <div>
                    <Loader active inline="centered" />
                  </div>
                )}
                {userRooms.map((room) => (
                  <Segment
                    key={room.id}
                    style={{ cursor: "pointer", marginLeft: '7rem', marginRight: '7rem' }}
                    onClick={() => enterSingleRoom(room.title)}
                  >
                    <div>
                      <h3 as="a">{room.title}</h3>
                      <List.Description>{room.parts.length} users</List.Description>
                    </div>
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
    margin: "1.5rem",
    padding: "5rem",
    textAlign: "center",
    // height: "58vh",
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
