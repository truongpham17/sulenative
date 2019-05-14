import { GET_REPORT_FAILURE, GET_REPORT_REQUEST, GET_REPORT_SUCCESS } from '../actions/report';

const INITIAL_STATE = {
  loading: false,
  totalSoldMoney: 0,
  reportByStore: [],
  reportByTime: [],
  billCount: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REPORT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case GET_REPORT_FAILURE:
      return {
        ...state,
        loading: false
      };
    case GET_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        ...action.payload
      };
    default:
      return {
        ...state
      };
  }
};
