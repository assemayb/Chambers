import React, { Fragment } from "react";
import { Segment, List, Divider, Container } from "semantic-ui-react";




export default function Footer() {
  return (
    <Fragment>
      <Segment style={styles.segment}>
        <Container textAlign="center">
          <List horizontal inverted divided link size="small">
            <List.Item   style={{ color: "blue" }}>
              Questions and Discussions
            </List.Item>
          </List>
        </Container>
      </Segment>
    </Fragment>
  );
}

const styles = {
  segment: {
    padding: "2rem",
    marginTop: "80px",    
  },
};
