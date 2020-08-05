import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  Header,
  Icon,
  Divider,
  Segment,
  Image,
  Loader,
  Dimmer,
  Button,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { authAxios } from "../utils";
import { roomsURL } from "../constants";
import axios from "axios";

function SingleRoom(props) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [dataChanged, setDataChanged] = useState(false);

  const [votes, setVotes] = useState(0);

  let roomTitle = props.match.params.roomName;
  roomTitle = roomTitle.split("_");
  let arrLength = roomTitle.length;
  let newTitle = "";
  for (let i = 0; i < arrLength - 1; i++) {
    newTitle += roomTitle[i] += " ";
  }
  newTitle += roomTitle[arrLength - 1];

  useEffect(() => {
    const getRoomData = () => {
      if (props.isLoggedIn) {
        authAxios
          .get(`${roomsURL}/${newTitle}`)
          .then((res) => {
            let data = res.data;
            setQuestions(data);
            setLoading(false);
          })
          .catch((err) => console.error(err));
      }
    };
    getRoomData();
  }, [loading, setLoading]);

  const submitAnswer = (dataObj) => {
    const { questionTitle, answerValue } = dataObj;
    // console.log(questionTitle, answerValue);
    if (questionTitle && answerValue) {
      axios
        .put(`${roomsURL}/${newTitle}/vote-for-answer`, {
          questionTitle,
          answer: answerValue,
        })
        .then((res) => {
          console.log(res.data);
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        })
        .then(setLoading(false))
        .catch((err) => {
          console.error(err);
        });
    } else {
      setTimeout(() => setMessage("Error"), 3000);
    }
  };

  // helper function
  const countQuestionVotes = (question) => {
    let allVotesVal = 0;
    question.answers.map((ans) => {
      allVotesVal += ans.vote;
    });
    return allVotesVal;
  };

  return (
    <Container>
      <Container style={styles.header}>
        <Header as="h2" icon textAlign="center">
          <Icon name="wechat" circular />
          <Header.Content>{newTitle} Questions</Header.Content>
        </Header>
      </Container>
      <Divider hidden />
      {message && { message }}

      {loading ? (
        <Segment style={{ height: "60vh" }}>
          <Dimmer active inverted>
            <Loader size="big">Loading</Loader>
          </Dimmer>
          <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        </Segment>
      ) : (
        <Container style={styles.mainContainer}>
          <Divider />
          {questions.map((question) => {
            let allQuestionVotes = countQuestionVotes(question);
            return (
              <Container>
                <Container>
                  <Header style={{ textAlign: "center", marginBottom: "20px" }}>
                    {question.title}
                    {/* <span style={{marginLeft: '10rem'}} >add answer</span> */}
                  </Header>
                </Container>
                <Segment.Group horizontal>
                  {question.answers.map((ans) => {
                    let ansPer = Math.round(
                      (ans.vote / allQuestionVotes) * 100
                    );
                    return (
                      <>
                        <Segment
                          as="a"
                          key={ans.id}
                          style={{ textAlign: "center" }}
                        >
                          <Button
                            fluid
                            onClick={() =>
                              submitAnswer({
                                questionTitle: question.title,
                                answerValue: ans.value,
                              })
                            }
                          >
                            {ans.value}
                          </Button>
                          <Segment>
                            {!isNaN(ansPer) ? (
                              <p> {ansPer} % </p>
                            ) : (
                              <p>no votes yet</p>
                            )}
                          </Segment>
                        </Segment>
                      </>
                    );
                  })}
                </Segment.Group>
              </Container>
            );
          })}
        </Container>
      )}
    </Container>
  );
}

const styles = {
  mainContainer: {
    backgroundColor: "#fcfcfc",
    marginTop: "0.6rem",
    padding: "2rem",
  },
  header: {
    marginTop: "0.6rem",
    padding: "1rem",s
  },
  singleQuestion: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
  },
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.token !== null,
  };
};

export default withRouter(connect(mapStateToProps)(SingleRoom));

