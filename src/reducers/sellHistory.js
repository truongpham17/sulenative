import {
  LOAD_LIST_BILL_SUCCESS,
  LOAD_BILL_DETAIL_FAILURE,
  LOAD_BILL_DETAIL_REQUEST,
  LOAD_BILL_DETAIL_SUCCESS
} from '../actions/sellHistory';
import { Bill } from '../models';
import LOAD_NUMBER from '../utils/System';

const INITIAL_STATE = {
  listBill: [],
  currentBill: Bill.map({}),
  loading: false,
  total: 0,
  skip: 0
};

export default (state = INITIAL_STATE, action) => {
  let listBill = [];
  switch (action.type) {
    case LOAD_LIST_BILL_SUCCESS:
      listBill = action.payload.isContinue
        ? [...state.listBill, ...action.payload.list]
        : action.payload.list;
      return {
        ...state,
        listBill,
        skip: action.payload.skip + LOAD_NUMBER,
        total: action.payload.total
      };
    case LOAD_BILL_DETAIL_REQUEST:
      return {
        ...state,
        loading: true
      };
    case LOAD_BILL_DETAIL_FAILURE:
      return { ...state, loading: false };
    case LOAD_BILL_DETAIL_SUCCESS:
      return {
        ...state,
        currentBill: Bill.map(action.payload)
      };
    default:
      return state;
  }
};
