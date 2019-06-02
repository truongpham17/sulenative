import { query } from '../services/api';
// import { ENDPOINTS, METHODS } from '../constants/api';

export const GET_CUSTOMER_REQUEST = 'get-customer-request';
export const GET_CUSTOMER_SUCCESS = 'get-customer-success';
export const GET_CUSTOMER_FAILURE = 'get-customer-failure';


export function getCustomer() {
  return async dispatch => {
    try {
      const data = await query({ endpoint: '/customer' });
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
      dispatch({
        type: GET_CUSTOMER_FAILURE
      });
    }
  };
}
