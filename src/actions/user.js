import { query } from '../services/api';
import { ENDPOINTS, METHODS } from '../constants/api';

export const LOGIN_REQUEST = 'login-request';
export const LOGIN_SUCCESS = 'login-success';
export const LOGIN_FAILURE = 'login-failure';
export const LOGOUT = 'logout';

export const GET_USER_REQUEST = 'get-user-request';
export const GET_USER_SUCCESS = 'get-user-success';
export const GET_USER_FAILURE = 'get-user-failure';

export const ADD_USER_REQUEST = 'add-user-request';
export const ADD_USER_SUCCESS = 'add-user-success';
export const ADD_USER_FAILURE = 'add-user-failure';

export const UPDATE_USER_REQUEST = 'add-user-request';
export const UPDATE_USER_SUCCESS = 'add-user-success';
export const UPDATE_USER_FAILURE = 'add-user-failure';

export const SET_PRINTER_DEVICE = 'set-printer-device';

export const SET_PRINTER_CONNECT = 'set-printer-connect';

export const SELECT_USER = 'select-user';

export const GET_USER_INFO_REQUEST = 'get-user-info-request';
export const GET_USER_INFO_SUCCESS = 'get-user-info-success';
export const GET_USER_INFO_FAILURE = 'get-user-info-failure';

export function login(data, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const result = await query({ data, endpoint: ENDPOINTS.login, method: METHODS.post });
      if (result.status === 200) {
        if (!result.data.active) {
          callback.failure(true);
          dispatch({
            type: LOGIN_FAILURE
          });
        } else {
          dispatch({
            type: LOGIN_SUCCESS,
            payload: result.data
          });
          callback.success();
        }
      } else {
        callback.failure();
        dispatch({
          type: LOGIN_FAILURE
        });
      }
    } catch (error) {
      callback.failure();
      dispatch({
        type: LOGIN_FAILURE,
        payload: error
      });
    }
  };
}

export function getUser(callback) {
  return async dispatch => {
    try {
      dispatch({
        type: GET_USER_REQUEST
      });
      const result = await query({ endpoint: '/user' });
      if (result.status === 200) {
        dispatch({
          type: GET_USER_SUCCESS,
          payload: result.data.list
        });
        callback();
      } else {
        callback();
        dispatch({
          type: GET_USER_FAILURE
        });
      }
    } catch (error) {
      callback();
      dispatch({
        type: GET_USER_FAILURE
      });
    }
  };
}

export function getUserInfo(id, callback) {
  return async dispatch => {
    try {
      dispatch({
        type: GET_USER_INFO_REQUEST
      });
      const result = await query({ endpoint: `/user/${id}` });
      if (result.status === 200) {
        dispatch({
          type: GET_USER_INFO_SUCCESS,
          payload: result.data
        });
        callback.success();
      } else {
        callback.failure();
        dispatch({
          type: GET_USER_INFO_FAILURE
        });
      }
    } catch (error) {
      callback.failure();
      dispatch({
        type: GET_USER_INFO_FAILURE
      });
    }
  };
}

export function addUser(data, callback) {
  return async dispatch => {
    try {
      const { username, password, fullname, role, active } = data;
      dispatch({
        type: ADD_USER_REQUEST
      });
      const result = await query({
        endpoint: '/user/add',
        data: { username, password, fullname, role, active },
        method: METHODS.post
      });
      if (result.status === 201) {
        if (callback.success) {
          callback.success();
        }
        dispatch({
          type: ADD_USER_SUCCESS,
          payload: result.data.list
        });
      } else {
        if (callback.failure) {
          callback.failure();
        }
        dispatch({
          type: ADD_USER_FAILURE
        });
      }
    } catch (error) {
      if (callback.failure) {
        callback.failure();
      }
      dispatch({
        type: ADD_USER_FAILURE
      });
    }
  };
}

export function updateUser(id, data, callback = {}) {
  return async dispatch => {
    try {
      dispatch({
        type: UPDATE_USER_REQUEST
      });
      const result = await query({
        endpoint: `/user/${id}`,
        data,
        method: METHODS.patch
      });
      if (result.status === 200) {
        if (callback.success) {
          callback.success();
        }
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: result.data.list
        });
      } else {
        if (callback.failure) {
          callback.failure();
        }
        dispatch({
          type: UPDATE_USER_FAILURE
        });
      }
    } catch (error) {
      console.log(error);
      if (callback.failure) {
        callback.failure();
      }
      dispatch({
        type: UPDATE_USER_FAILURE
      });
    }
  };
}

export function selectUser(id) {
  return {
    type: SELECT_USER,
    payload: id
  };
}

export function logout(callback = {}) {
  callback.success();
  return {
    type: LOGOUT
  };
}

export function setPrinterDevice(data) {
  return {
    type: SET_PRINTER_DEVICE,
    payload: data // url & name & connected
  };
}

export function setPrinterConnect(isConnect) {
  return {
    type: SET_PRINTER_CONNECT,
    payload: isConnect // url & name & connected
  };
}
