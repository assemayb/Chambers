import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Container, Segment } from "semantic-ui-react";
import OutPage from "./OutPage";
import Inpage from "./Inpage";

import { roomsURL } from "../constants";
import { connect } from "react-redux";
import { authAxios } from "../utils";

const MainLayout = React.memo((props) => {
  const [userRooms, setUserRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = props.isLoggedIn;
  const admin = props.currentLoggedUser;

  useEffect(() => {
    const getUserRooms = () => {
      authAxios
        .get(`${roomsURL}/user-rooms`)
        .then((res) => {
          setUserRooms(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getUserRooms();
  }, []);

  const enterSingleRoom = (title) => {
    let roomtitle = title.split(" ");
    let newTitle = "";
    if (roomtitle.length === 1) {
      newTitle = roomtitle[0];
    } else {
      let arrLength = roomtitle.length;
      for (let i = 0; i < arrLength - 1; i++) {
        newTitle += roomtitle[i] += "_";
      }
      newTitle += roomtitle[arrLength - 1];
    }
    props.history.push(`/rooms/${newTitle}`);
  };

  return (
    <Container style={styles.container}>
      {isLoggedIn ? (
        <Inpage
          enterSingleRoom={enterSingleRoom}
          userRooms={userRooms}
          loading={loading}
        />
      ) : (
        <OutPage />
      )}
    </Container>
  );
});

const styles = {
  container: {
    margin: "2rem",
    padding: "4rem",
    textAlign: "center",
  },
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.token !== null,
    currentLoggedUser: state.auth.currentLoggedUser,
  };
};

export default connect(mapStateToProps)(MainLayout);
