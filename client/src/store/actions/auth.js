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

export const authSuccess = (token) => {
  return {
    type: AUTH_SUCCESS,
    token,
  };
};

export const authFail = (err) => {
  return {
    type: AUTH_FAIL,
    error: err,
  };
};

export const authLogout = () => {
  localStorage.removeItem("accessToken");
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
  return (disptch) => {
    disptch(authStart());
    axios
      .post(`${authURL}/login`, {
        username,
        password,
      })
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        disptch(authSuccess(accessToken));
      })
      .catch((err) => {
        disptch(authFail(err));
      });
  };
};

export const authSignUp = (username, password) => {
  return (disptch) => {
    axios
      .post(`${authURL}/create-account`, {
        username,
        password,
      })
      .then((res) => {
        let resData = res.data;
        disptch(authSignup(resData));
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const authCheckState = () => {
  return (disptch) => {
    let token = localStorage.getItem("accessToken");
    if (token === undefined || token == null) {
      return;
    } else {
      disptch(authSuccess(token));
    }
  };
};
