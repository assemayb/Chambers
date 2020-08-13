import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Icon,
  Divider,
  Card,
  Segment,
  Image,
  Loader,
  Dimmer,
  Button,
  Grid,
  List,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { authAxios, prettifyLocation } from "../utils";
import { roomsURL } from "../constants";

function UserProfile({ loggedUser, history }) {
  const [userData, setUserData] = useState({
    loading: true,
    roomAsAdmin: [],
    roomAsPart: [],
  });
  const [createdQuestions, setCreatedQuestions] = useState({
    laoding: true,
    data: [],
  });

  useEffect(() => {
    const getCreatedQuestions = () => {
      console.log("created quesitons");
      authAxios
        .get(`${roomsURL}/user-questions`)
        .then((res) => {
          console.log(res.data);
          setCreatedQuestions({ data: res.data });
        })
        .catch((err) => console.error(err));
    };
    getCreatedQuestions();
  }, []);

  useEffect(() => {
    const getUserInfo = () => {
      authAxios
        .get(`${roomsURL}/user-rooms`)
        .then((res) => {
          const userInfo = res.data;
          setUserData({
            loading: false,
            roomAsAdmin: userInfo[0],
            roomAsPart: userInfo[1],
          });
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getUserInfo();
  }, []);

  const enterSingleRoom = (title) => {
    const newTitle = prettifyLocation(title);
    history.push(`/rooms/${newTitle}`);
  };
  return (
    <Container style={styles.mainContainer}>
      <Container style={{ marginBottom: "2rem" }}>
        <Header style={{ padding: ".50rem", textAlign: "center" }}>
          {" "}
          Hey what's up, {loggedUser} !
        </Header>
      </Container>
      <Grid columns="equal" >
        <Grid.Row cols={3}>
          <Grid.Column>
            <Segment>
              <List>
                <Header
                  textAlign="center"
                  as="h3"
                  style={{ padding: ".50rem" }}
                >
                  <Icon name="question circle"></Icon>
                  Questions you created
                </Header>
                <Segment>
                  <>
                    {createdQuestions.laoding ? (
                      <Loader active inline="centered" />
                    ) : (
                      createdQuestions.data.map((q, index) => (
                        <List.Item link key={q.id}>
                          <Container>
                            <Card.Content style={{ cursor: "pointer" }}>
                              <Card.Header>{q.title}</Card.Header>
                            </Card.Content>
                          </Container>
                        </List.Item>
                      ))
                    )}
                  </>
                </Segment>
              </List>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <List style={{ textAlign: "center" }}>
              <Segment>
                <Header
                  textAlign="center"
                  as="h3"
                  style={{ padding: ".50rem" }}
                >
                <Icon name="box"/>
                  Rooms you partake in
                </Header>
                <Segment>
                  {userData.loading ? (
                    <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
                  ) : (
                    userData.roomAsPart.map((room) => {
                      return (
                        <List.Item key={room.id}>
                          <Container>
                            <Card
                              style={{
                                padding: ".5rem",
                                marginBottom: ".5rem",
                                backgroundColor: "#FAFAFA",
                              }}
                            >
                              <Card.Content
                                style={{ cursor: "pointer", padding: '.25rem' }}
                                onClick={() => enterSingleRoom(room)}
                              >
                                <Card.Header>{room}</Card.Header>
                                {/* {room.title} */}
                              </Card.Content>
                            </Card>
                          </Container>
                        </List.Item>
                      );
                    })
                  )}
                </Segment>
              </Segment>
            </List>
          </Grid.Column>
          <Grid.Column >
            <Segment>
              <List style={{ textAlign: "center" }} relaxed>
                <Header
                  textAlign="center"
                  as="h3"
                  style={{ padding: ".50rem" }}
                >
                  <Icon name="box"/>
                  Rooms you created
                </Header>
                <Segment>
                  {userData.loading ? (
                    <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
                  ) : (
                    userData.roomAsAdmin.map((room) => {
                      return (
                        <List.Item key={room.id}>
                          <Container>
                            <Card
                              style={{
                                padding: ".5rem",
                                marginBottom: ".5rem",
                                backgroundColor: "#FAFAFA",
                              }}
                            >
                              <Card.Content
                                style={{ cursor: "pointer", padding: ".25rem" }}
                                onClick={() => enterSingleRoom(room.title)}
                              >
                                <Card.Header>{room.title}</Card.Header>
                                {/* {room.title} */}
                              </Card.Content>
                            </Card>
                          </Container>
                        </List.Item>
                      );
                    })
                  )}
                </Segment>
              </List>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    loggedUser: state.auth.currentLoggedUser,
  };
};

const styles = {
  mainContainer: {
    marginTop: "3rem",
    marginLeft: "4rem",
    marginRight: "4rem",
    padding: "2rem",
    textAlign: "center"
  },
};

export default connect(mapStateToProps)(UserProfile);
