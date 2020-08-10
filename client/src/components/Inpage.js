import React, { useState, useRef, useEffect } from "react";
import {
  Segment,
  Container,
  Grid,
  Header,
  Form,
  Button,
  Loader,
  List,
  Card,
  Dropdown,
} from "semantic-ui-react";
import { authAxios } from "../utils";
import { roomsURL } from "../constants";

export default function Inpage({
  enterSingleRoom,
  userRooms,
  loading,
  currentAdmin,
  setLoading
}) {
  const [newRoom, setNewRoom] = useState({
    username: currentAdmin,
    title: "",
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let dropdownOptions = [];
    for (let room in userRooms) {
      const roomObj = {
        key: room,
        text: userRooms[room].title,
        value: room,
      };
      dropdownOptions.push(roomObj);
    }
    setOptions(dropdownOptions);
  }, [userRooms, loading]);

  const handleOnChange = (name, value) => {
    setNewRoom({ ...newRoom, [name]: value });
  };
  const submitNewRoom = () => {
    const { username, title } = newRoom;
    if (title && username) {
      authAxios
        .post(`${roomsURL}/create`, { username, title })
        .then((res) => {
          setLoading(true)
        })
        .catch((err) => console.error(err));
    }
  };

  const submitNewQuestion = () => {
    const el = document.getElementById("roomTitleElement");
    const roomTitle = el && el.innerText;
    if (newQuestion && roomTitle) {
      authAxios
        .post(`${roomsURL}/${roomTitle}/create-question`, {
          question: newQuestion,
        })
        .then((res) => {
          setLoading(true)
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    }
  };
  return (
    <Container>
      <Grid columns={2} doubling>
        <Grid.Row>
          <Grid.Column width={4}>
            <Segment style={{ marginLeft: "2rem" }}>
              <Segment
                style={{
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Header> new rooms</Header>
              </Segment>
              <Segment
                style={{
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Form onSubmit={submitNewRoom}>
                  <Form.Field>
                    <label>room title</label>
                    <input
                      placeholder="enter a title..."
                      name="title"
                      onChange={(e) =>
                        handleOnChange(e.target.name, e.target.value)
                      }
                    />
                  </Form.Field>
                  <Button compact type="submit">
                    create
                  </Button>
                </Form>
              </Segment>
            </Segment>
          </Grid.Column>

          <Grid.Column width={5}>
            <Segment style={{ marginLeft: "2rem" }}>
              <Segment
                style={{
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Header>questions</Header>
              </Segment>
              <Segment>
                <Form onSubmit={submitNewQuestion}>
                  <Form.Field>
                    <label>room title</label>
                    <Dropdown
                      id="roomTitleElement"
                      placeholder="choose title"
                      clearable
                      options={options}
                      fluid
                      selection
                    />
                  </Form.Field>

                  <Form.Field>
                    <label>add a question</label>
                    <input
                      placeholder="enter a question.."
                      name="question"
                      onChange={(e) => setNewQuestion(e.target.value)}
                    />
                  </Form.Field>
                  <Button compact type="submit">
                    create
                  </Button>
                </Form>
              </Segment>
            </Segment>
          </Grid.Column>
          <Grid.Column width={5}>
            <Segment style={{ marginLeft: "2rem" }}>
              <Segment
                style={{
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Header>your rooms</Header>
              </Segment>
              <Segment>
                {loading && (
                  <div>
                    <Loader active inline="centered" />
                  </div>
                )}

                <List relaxed style={{ padding: "1rem" }}>
                  {userRooms.map((room) => {
                    return (
                      <List.Item>
                        <Card
                          style={{ width: "200px", backgroundColor: "#FAFAFA" }}
                          onClick={() => enterSingleRoom(room.title)}
                        >
                          <Card.Content>
                            <Card.Header>{room.title}</Card.Header>
                            <Card.Meta style={{ fontSize: "10px" }}>
                              {room.parts.length} users
                            </Card.Meta>
                          </Card.Content>
                        </Card>
                      </List.Item>
                    );
                  })}
                </List>
              </Segment>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
