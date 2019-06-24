import {
  LOAD_PRODUCT_IMPORT_SUCCESS,
  LOAD_PRODUCT_IMPORT_FAILURE,
  LOAD_PRODUCT_IMPORT_REQUEST,
  REMOVE_PRODUCT_ITEM,
  ADD_PRODUCT_IMPORT,
  SET_DEBT,
  SET_NOTE,
  EASE_IMPORT_DATA
} from '../actions';
import LOAD_NUMBER from '../utils/System';

const INITIAL_STATE = {
  products: [],
  total: 0,
  skip: 0,
  loading: false,
  removeAll: false,
  totalQuantity: 0,
  totalPrice: 0,
  debt: 0,
  note: ''
};

function calculateTotalValue(products) {
  let totalPrice = 0;
  let totalQuantity = 0;
  products.forEach(item => {
    totalPrice += item.quantity * item.importPrice;
    totalQuantity += item.quantity;
  });
  return {
    totalPrice,
    totalQuantity,
  };
}


export default (state = INITIAL_STATE, action) => {
  let data = {};
  let products = [];
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
    case ADD_PRODUCT_IMPORT:
      products = [...state.products, action.payload];
      data = calculateTotalValue(products);
      return {
        ...state,
        products,
        ...data
      };
    case SET_DEBT:
    return {
      ...state,
      debt: Number.isInteger(parseInt(action.payload, 10)) ? parseInt(action.payload, 10) : 0
    };
    case SET_NOTE:
    return {
      ...state,
      note: action.payload
    };
    case EASE_IMPORT_DATA: return INITIAL_STATE;
    default:
      return { ...state, loading: false };
  }
};
