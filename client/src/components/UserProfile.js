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
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { authAxios } from "../utils";
import { roomsURL } from "../constants";

function UserProfile({ loggedUser }) {
  const [userData, setUserData] = useState({
    loading: true,
    roomAsAdmin: [],
    roomAsPart: [],
  });
  const [createdQuestions, setCreatedQuestions] = useState({
    laoding: true,
    data: [],
  });
  const [answeredQuestions, setAnsweredQuestions] = useState({
    laoding: true,
    data: [],
  });

  useEffect(() => {
    const getCreatedQuestions = () => {
      console.log("created quesitons");
      authAxios
        .get(`${roomsURL}/user-questions`)
        .then((res) => {
          setCreatedQuestions({ data: res.data });
        })
        .catch((err) => console.error(err));
    };
    getCreatedQuestions();
  }, []);

  useEffect(() => {
    const getAnsweredQuestions = () => {
      console.log("answered quesitons");
    };
    getAnsweredQuestions();
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

  console.log(userData);
  return (
    <Container style={styles.mainContainer}>
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <Segment>
              <Header textAlign='center' as="h4">Questions you created</Header>
              <>
                {createdQuestions.laoding ? (
                  <Loader active inline="centered" />
                ) : (
                  createdQuestions.data.map((q) => <Card  link key={q.id} meta={q} />)
                )}
              </>
            </Segment>
          </Grid.Column>

          <Grid.Column width={6}>
            <Grid.Row>
              <Segment>
                {userData.loading ? (
                  <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
                ) : (
                  userData.roomAsAdmin.map((room) => {
                    return (
                      <Card key={room.id}>
                        <Card.Content>{room.title}</Card.Content>
                      </Card>
                    );
                  })
                )}
              </Segment>
            </Grid.Row>

            <Grid.Row>
              <Segment>
                {userData.loading ? (
                  <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
                ) : (
                  userData.roomAsPart.map((room) => {
                    return (
                      <Card key={room.id}>
                        <Card.Content>{room}</Card.Content>
                      </Card>
                    );
                  })
                )}
              </Segment>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column>
            <Segment>
              <h4>Question you answered</h4>
              <Segment>1</Segment>
              <Segment>2</Segment>
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
    marginTop: "2rem",
    padding: "3rem",
  },
};

export default connect(mapStateToProps)(UserProfile);
