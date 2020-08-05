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
  const refreshToken = localStorage.getItem("refreshToken");
  let accessToken = localStorage.getItem("accessToken");

  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("expDate");

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
  return (disptch) => {
    disptch(authStart());
    axios
      .post(`${authURL}/login`, {
        username,
        password,
      })
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        const expDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("expDate", expDate);

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
  let accessToken = localStorage.getItem("accessToken");
  let refreshToken = localStorage.getItem("refreshToken");

  let exp = localStorage.getItem("expDate");
  let expDate = exp && new Date(exp);
  const nowDate = new Date(new Date().getTime());
  console.log("Auth CheckState function");

  return (disptch) => {
    if (refreshToken && accessToken) {
      if (expDate > nowDate) {
        disptch(authSuccess(accessToken));
      } else {
        axios
          .post(`${authURL}/token`, { token: refreshToken })
          .then((res) => {
            console.log(res.data.accessToken);
            localStorage.removeItem("accessToken");
            localStorage.setItem("accessToken", res.data.accessToken);
          })
          .catch((err) => console.error(err));
      }
    }
    //  if() {
    //   disptch(authLogout());
    // }
  };
};
