import {
  AUTH_FAIL,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_SIGNUP,
} from "./actionsTypes";
import axios from "axios";
import { authURL } from "../../constants";

export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

export const authSuccess = (token, username) => {
  return {
    type: AUTH_SUCCESS,
    token,
    username,
  };
};

export const authFail = (err) => {
  return {
    type: AUTH_FAIL,
    error: err,
  };
};

export const authLogout = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  localStorage.clear();
  if (refreshToken && accessToken) {
    axios
      .post(`${authURL}/logout`, { token: refreshToken })
      .then((res) => {
        console.log(res.status);
      })
      .catch((err) => console.error(err));
  }
  return {
    type: AUTH_LOGOUT,
  };
};

export const authSignup = (info) => {
  if (info) {
    const { msg, status } = info;
    localStorage.setItem("msg", msg);
    localStorage.setItem("status", status);
  }
  return {
    type: AUTH_SIGNUP,
    info,
  };
};

export const authLogin = (username, password) => {
  localStorage.clear();
  return (dispatch) => {
    axios
      .post(`${authURL}/login`, {
        username,
        password,
      })
      .then((res) => {
        let msg = res.data.msg
        if (msg) {
          dispatch(authFail(msg))
        } else {
          const { accessToken, refreshToken, username } = res.data;
          const expDate = new Date(new Date().getTime() + 3600 * 1000);
          localStorage.setItem("username", username);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("expDate", expDate);
          dispatch(authStart());

          dispatch(authSuccess(accessToken, username));
        }
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authSignUp = (username, password) => {
  return (dispatch) => {
    axios
      .post(`${authURL}/create-account`, {
        username,
        password,
      })
      .then((res) => {
        let resData = res.data;
        dispatch(authSignup(resData));
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const authCheckState = () => {
  let username = localStorage.getItem("username");
  let accessToken = localStorage.getItem("accessToken");
  let refreshToken = localStorage.getItem("refreshToken");

  let exp = localStorage.getItem("expDate");
  let expDate = exp && new Date(exp);
  const nowDate = new Date(new Date().getTime());

  console.log("Auth CheckState function");

  return (dispatch) => {
    if (refreshToken && accessToken) {
      if (expDate > nowDate) {
        dispatch(authSuccess(accessToken, username));
      } else {
        axios
          .post(`${authURL}/token`, { token: refreshToken })
          .then((res) => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("expDate");
            localStorage.setItem("accessToken", res.data.accessToken);
            const expDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem("expDate", expDate);
            dispatch(authSuccess(res.data.accessToken, username));
          })
          .catch((err) => console.error(err));
      }
    }
  };
};
