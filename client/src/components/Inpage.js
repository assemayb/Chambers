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
import RemoveModal from "./RemoveModal";
import { authAxios } from "../utils";
import { roomsURL } from "../constants";

export default function Inpage({
  enterSingleRoom,
  userRooms,
  currentAdmin,
  loading,
  setLoading,
  dataChanged,
  setDataChanged,
}) {
  const [newRoom, setNewRoom] = useState({ username: currentAdmin, title: "" });
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionAns, setNewQuesionAns] = useState(["ans one"]);
  const [options, setOptions] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState("");

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
  }, [userRooms]);

  useEffect(() => {
    console.log("data changed");
  }, [dataChanged]);

  const handleOnChange = (name, value) => {
    setNewRoom({ ...newRoom, [name]: value });
  };

  const submitNewRoom = () => {
    const { username, title } = newRoom;
    if (title && username) {
      authAxios
        .post(`${roomsURL}/create`, { title })
        .then((res) => {
          setDataChanged((prevState) => !prevState);
        })
        .catch((err) => console.error(err));
    }
  };

  const deleteClickedRoom = () => {
    const title = roomToDelete;
    console.log(title);
    authAxios
      .delete(`${roomsURL}/${title}`, { data: { adminName: currentAdmin } })
      .then((res) => {
        console.log(res.data);
        setOpenModel(false);
        setLoading(true);
        // setDataChanged((prev) => !prev);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const increaseAnsArr = () => {
    let ans = newQuestionAns;
    ans.push("another answer");
    setNewQuesionAns(ans);
    setDataChanged((prev) => !prev);
    console.log(newQuestionAns);
  };

  function handleAddAns(itemInex, ansVal) {
    let questionAns = newQuestionAns;
    questionAns[itemInex] = ansVal;
    setNewQuesionAns(questionAns);
    console.log(newQuestionAns);
  }

  function submitNewQuestion() {
    const el = document.getElementById("roomTitleElement");
    const roomTitle = el && el.innerText;
    let newQuestionAnswers = [];
    newQuestionAns.forEach((ans) => {
      newQuestionAnswers.push(ans);
    });
    const isEnoughAns = newQuestionAnswers.length >= 3;
    if (newQuestion && roomTitle) {
      if (isEnoughAns) {
        authAxios
          .post(`${roomsURL}/${roomTitle}/create-question`, {
            question: newQuestion,
            answers: newQuestionAnswers,
          })
          .then((res) => {
            console.log(res.data);
            setLoading(true);
            window.location.reload(false);
          })
          .catch((err) => console.error(err));
      } else {
        console.error("not enough answers dude !");
      }
    }
  }

  const handleOpenModal = (title) => {
    setOpenModel(true);
    setRoomToDelete(title);
  };

  return (
    <Container>
      <RemoveModal
        setOpenModel={setOpenModel}
        currentAdmin={currentAdmin}
        deleteClickedRoom={deleteClickedRoom}
        openModel={openModel}
      />
      <Grid columns={2} doubling>
        <Grid.Row>
          <Grid.Column width={5}>
            <Segment style={styles.segmentShadow}>
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
            <Segment style={styles.segmentShadow}>
              <Segment
                style={{
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Header>questions</Header>
              </Segment>
              <Segment>
                <Form>
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
                  {newQuestionAns &&
                    newQuestionAns.map((ans, index) => {
                      return (
                        <Form.Field key={ans.id}>
                          <input
                            placeholder={newQuestionAns[index]}
                            name="answer"
                            onChange={(e) =>
                              handleAddAns(index, e.target.value)
                            }
                          />
                        </Form.Field>
                      );
                    })}
                  <Button.Group>
                    <Button
                      color="facebook"
                      floated="left"
                      compact
                      type="submit"
                      onClick={submitNewQuestion}
                    >
                      create
                    </Button>
                    <Button
                      floated="right"
                      compact
                      onClick={increaseAnsArr}
                      style={{ marginLeft: "8px" }}
                    >
                      add ans
                    </Button>
                  </Button.Group>
                </Form>
              </Segment>
            </Segment>
          </Grid.Column>
          <Grid.Column width={5}>
            <Segment style={styles.segmentShadow}>
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
                <List relaxed style={{ padding: "0.3rem" }}>
                  {userRooms.map((room) => {
                    return (
                      <List.Item>
                        <Container>
                          <Card style={{ backgroundColor: "#FAFAFA" }}>
                            <Card.Content
                              style={{ cursor: "pointer" }}
                              onClick={() => enterSingleRoom(room.title)}
                            >
                              <Card.Header>{room.title}</Card.Header>
                              <Card.Meta style={{ fontSize: "10px" }}>
                                {room.parts.length} users
                              </Card.Meta>
                            </Card.Content>
                            <Card.Content>
                              <Button
                                onClick={() => handleOpenModal(room.title)}
                                icon="trash"
                              ></Button>
                            </Card.Content>
                          </Card>
                        </Container>
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


const styles = {
  segmentShadow: {
    marginLeft: "2rem",
  }
}