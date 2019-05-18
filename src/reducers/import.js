import {
  LOAD_PRODUCT_IMPORT_SUCCESS,
  LOAD_PRODUCT_IMPORT_FAILURE,
  LOAD_PRODUCT_IMPORT_REQUEST,
  REMOVE_PRODUCT_ITEM
} from '../actions';
import LOAD_NUMBER from '../utils/System';

const INITIAL_STATE = {
  products: [],
  total: 0,
  skip: 0,
  loading: false,
  removeAll: false
};

export default (state = INITIAL_STATE, action) => {
  let products;
  switch (action.type) {
    case LOAD_PRODUCT_IMPORT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case LOAD_PRODUCT_IMPORT_FAILURE:
      return {
        ...state,
        loading: false
      };
    case LOAD_PRODUCT_IMPORT_SUCCESS:
      products = action.payload.isContinue
        ? [...state.products, ...action.payload.products]
        : [...action.payload.products];
      return {
        products,
        total: action.payload.total,
        skip: action.payload.skip + LOAD_NUMBER,
        loading: false,
        removeAll: false
      };
    case REMOVE_PRODUCT_ITEM:
      return {
        ...state,
        products: [],
        skip: 0,
        removeAll: true
      };
    default:
      return { ...state, loading: false };
  }
};
