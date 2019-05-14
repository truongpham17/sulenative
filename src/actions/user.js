import { query } from '../services/api';
import { ENDPOINTS, METHODS } from '../constants/api';

export const LOGIN_REQUEST = 'login-request';
export const LOGIN_SUCCESS = 'login-success';
export const LOGIN_FAILURE = 'login-failure';
export const LOGOUT = 'logout';

export function login(data, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: LOGIN_REQUEST });
      const result = await query({ data, endpoint: ENDPOINTS.login, method: METHODS.post });
      if (result.status === 200) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: result.data
        });
        callback.success();
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

export function logout(callback = {}) {
  callback.success();
  return {
    type: LOGOUT
  };
}
