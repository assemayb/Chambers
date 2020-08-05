import React, { useState, useEffect } from "react";
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
} from "semantic-ui-react";
import axios from "axios";
import { connect } from 'react-redux'

function MainLayout() {
  let token = localStorage.getItem('accessToken')
  return (
    <Container style={styles.container}>
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
          {!token && (
            <Grid.Column style={styles.column}>
              <h3>
                Login in <a href="/login">here</a>
              </h3>
              <Divider />
              <h3>
                create an account <a href="/signup">here</a>
              </h3>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
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

export default connect()(MainLayout);
