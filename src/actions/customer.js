import { query } from '../services/api';
import { METHODS } from '../constants/api';
// import { ENDPOINTS, METHODS } from '../constants/api';

export const GET_CUSTOMER_REQUEST = 'get-customer-request';
export const GET_CUSTOMER_SUCCESS = 'get-customer-success';
export const GET_CUSTOMER_FAILURE = 'get-customer-failure';

export const SEARCH_CUSTOMER_REQUEST = 'search-customer-request';
export const SEARCH_CUSTOMER_SUCCESS = 'search-customer-success';
export const SEARCH_CUSTOMER_FAILURE = 'search-customer-failure';

export const ADD_CUSTOMER_DEBT_REQUEST = 'add-customer-debt-request';
export const ADD_CUSTOMER_DEBT_SUCCESS = 'add-customer-debt-success';
export const ADD_CUSTOMER_DEBT_FAILURE = 'add-customer-debt-failure';


export const CLEAR_CUSTOMER_LIST = 'clear-customer-list';

export function getCustomer({ search, isDebt }) {
  return async dispatch => {
    try {
      let queries;
      dispatch({
        type: GET_CUSTOMER_REQUEST
      });
      if (isDebt) {
        queries = { endpoint: '/customer?isDebt=true' };
      } else {
        queries = { endpoint: `/customer?search=${search}` };
      }
      const data = await query(queries);
      if (data.status === 200) {
        dispatch({
          type: GET_CUSTOMER_SUCCESS,
          payload: data.data.list
        });
      } else {
        dispatch({
          type: GET_CUSTOMER_FAILURE
        });
      }
    } catch (err) {
      console.log(err);
      dispatch({
        type: GET_CUSTOMER_FAILURE
      });
    }
  };
}

export function searchCustomer(username, callback) {
  return async dispatch => {
    try {
      dispatch({
        type: SEARCH_CUSTOMER_REQUEST
      });
      const data = await query({ endpoint: '/customer', data: { username } });
      if (data.status === 200) {
        callback.success();
        dispatch({
          type: SEARCH_CUSTOMER_SUCCESS,
          payload: data.data.list
        });
      } else {
        callback.failure();
        dispatch({
          type: SEARCH_CUSTOMER_FAILURE
        });
      }
    } catch (err) {
      callback.failure();
      dispatch({
        type: SEARCH_CUSTOMER_FAILURE
      });
    }
  };
}

export function clearCustomerList() {
  return {
    type: CLEAR_CUSTOMER_LIST
  };
}

export function addCustomerDebt({ id, debt }, callback) {
  return async dispatch => {
    try {
      dispatch({
        type: ADD_CUSTOMER_DEBT_REQUEST
      });
      const data = await query({ endpoint: '/customer/addDebt', data: { id, debt }, method: METHODS.patch });
      if (data.status === 201) {
        dispatch({
          type: ADD_CUSTOMER_DEBT_SUCCESS,
          payload: data.data
        });
      } else {
        dispatch({
          type: ADD_CUSTOMER_DEBT_FAILURE
        });
      }
    } catch (err) {
      dispatch({
        type: ADD_CUSTOMER_DEBT_FAILURE
      });
    }
  };
}
