import React, { useState } from "react";
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
  Reveal,
  Image,
} from "semantic-ui-react";

export default function Inpage({ enterSingleRoom, userRooms, loading }) {
  const [questions, setQuestions] = useState(["1"]);

  return (
    <Grid columns={2} doubling>
      <Grid.Row>
        <Grid.Column width={6}>
          <Segment
            style={{
              backgroundColor: "#FAFAFA",
            }}
          >
            <Header>Create new rooms</Header>
          </Segment>
          <Segment
            style={{
              backgroundColor: "#FAFAFA",
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
        <Grid.Column width={4}>{/* empty column */}</Grid.Column>
        <Grid.Column width={4}>
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
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
