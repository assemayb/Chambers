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
  Icon,
  Modal,
} from "semantic-ui-react";
import { authAxios } from "../utils";
import { roomsURL } from "../constants";

export default function Inpage({
  enterSingleRoom,
  userRooms,
  loading,
  currentAdmin,
  setLoading,
}) {
  const [newRoom, setNewRoom] = useState({
    username: currentAdmin,
    title: "",
  });
  const [newQuestion, setNewQuestion] = useState("");
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
          setLoading(true);
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
          setLoading(true);
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleOpenModal = (title) => {
    setOpenModel(true);
    setRoomToDelete(title);
  };

  const deleteClickedRoom = () => {
    const title = roomToDelete;
    if (title) {
      authAxios
        .delete(`${roomsURL}/${title}`, { data: { adminName: currentAdmin } })
        .then(setOpenModel(false))
        .then((res) => {
          console.log(res.data);
          setLoading(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  return (
    <Container>
      <Modal
        closeIcon
        open={openModel}
        onClose={() => setOpenModel(false)}
        onOpen={() => setOpenModel(true)}
      >
        <Header icon="trash" content="Deleting A Room" />
        <Modal.Content>
          <p>Are you sure you want to delete this room? {currentAdmin}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={() => setOpenModel(false)}>
            <Icon name="remove" /> No
          </Button>
          <Button color="red" onClick={deleteClickedRoom}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
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
