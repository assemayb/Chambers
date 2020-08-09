import React from "react";
import { Segment, Grid, Divider } from "semantic-ui-react";

export default function OutPage() {
  return (
    <Grid columns={3} style={styles.outGrid}>
      <Grid.Row>
        <Grid.Column>
          <Segment style={styles.outSegment}>
            <h2>Create different rooms with specific topics</h2>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment style={styles.outSegment}>
            <h2>Answer question at each rooms, edit or even delete them</h2>
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment style={styles.outSegment}>
            <h3>
              Login in <a href="/login">here</a>
            </h3>
            <Divider />
            <h3>
              create an account <a href="/signup">here</a>
            </h3>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

const styles = {
  outSegment: {
    padding: "3rem",
    height: "20hv",
  },
  outGrid: {
    marginTop: "5rem",
    marginBottom: "3rem",
  },
};
