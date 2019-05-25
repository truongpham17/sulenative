import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  GET_USER_SUCCESS
} from '../actions/user';
import {
  GET_REPORT_REQUEST,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  SELECT_USER,
  ADD_USER_SUCCESS,
  ADD_USER_REQUEST,
  ADD_STORE_FAILURE
} from '../actions';

const INITIAL_STATE = {
  isLogged: false,
  isLogging: false,
  error: null,
  info: null,
  loading: false,
  users: [],
  currentUser: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLogging: true,
        error: null,
        loading: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLogged: true,
        isLogging: false,
        error: null,
        info: { ...action.payload },
        loading: false
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLogging: false,
        error: action.payload,
        loading: false
      };
    case LOGOUT:
      return INITIAL_STATE;
    case GET_USER_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    case GET_USER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        loading: false
      };
    case SELECT_USER:
      return {
        ...state,
        currentUser: state.users.find(item => item._id === action.payload) || []
      };
    case ADD_USER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case ADD_STORE_FAILURE:
      return {
        ...state,
        loading: false
      };
    case ADD_USER_SUCCESS:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
