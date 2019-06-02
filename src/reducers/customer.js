import { GET_CUSTOMER_FAILURE, GET_CUSTOMER_REQUEST, GET_CUSTOMER_SUCCESS } from '../actions/customer';

const INITIAL_STATE = {
  customerList: []
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CUSTOMER_SUCCESS: return {
      customerList: action.payload
    };
    default: return { ...state };
  }
};
