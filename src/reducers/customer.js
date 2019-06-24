import { ADD_CUSTOMER_DEBT_SUCCESS, GET_CUSTOMER_SUCCESS,
  SEARCH_CUSTOMER_SUCCESS, CLEAR_CUSTOMER_LIST } from '../actions/customer';

const INITIAL_STATE = {
  customerList: []
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CUSTOMER_SUCCESS: return {
      customerList: action.payload
    };
    case SEARCH_CUSTOMER_SUCCESS: return {
      customerList: action.payload
    };
    case CLEAR_CUSTOMER_LIST: return {
      customerList: []
    };
    case ADD_CUSTOMER_DEBT_SUCCESS: return {
      customerList: state.customerList.map(item => item.id === action.payload.id ? action.payload : item)
    };
    default: return { ...state };
  }
};
