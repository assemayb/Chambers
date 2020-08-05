import {
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_START,
  AUTH_LOGOUT,
  AUTH_SIGNUP,
} from "../actions/actionsTypes";
import { updateObject } from "../helper";

const initialState = {
  token: null,
  error: null,
  loading: true,
  info: null,
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    laoding: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
  });
};

const authSignup = (state, action) => {
  return updateObject(state, {
    info: action.info,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
      return authStart(state, action);
    case AUTH_SUCCESS:
      return authSuccess(state, action);
    case AUTH_FAIL:
      return authFail(state, action);
    case AUTH_LOGOUT:
      return authLogout(state, action);
    case AUTH_SIGNUP:
      return authSignup(state, action);
    default:
      return state;
  }
};

export default reducer;
