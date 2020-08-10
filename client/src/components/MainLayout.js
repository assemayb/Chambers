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
import { authAxios, prettifyLocation } from "../utils";

const MainLayout = (props) => {  
  const isLoggedIn = props.isLoggedIn;
  const admin = props.currentLoggedUser;

  const [userRooms, setUserRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ currentAdmin , setcurrentAdmin ] = useState(admin)
  
  
  useEffect(() => {
     
    const getUserRooms = () => {
      if (isLoggedIn) {
        authAxios
          .get(`${roomsURL}/user-rooms`)
          .then((res) => {
            setLoading(false);
            setUserRooms(res.data);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    };

    getUserRooms();

    return () => {
      console.log("component unmounted")
      setUserRooms([]);
    };
  }, [currentAdmin, loading, setLoading]);

  const enterSingleRoom = (title) => {
    const newTitle = prettifyLocation(title)
    props.history.push(`/rooms/${newTitle}`);
  };

  return (
    <Container style={styles.container}>
      {isLoggedIn ? (
        <Inpage
          enterSingleRoom={enterSingleRoom}
          userRooms={userRooms}
          loading={loading}
          setLoading={setLoading}
          currentAdmin={currentAdmin}
        />
      ) : (
        <OutPage />
      )}
    </Container>
  );
}

const styles = {
  container: {
    margin: "3rem",
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
