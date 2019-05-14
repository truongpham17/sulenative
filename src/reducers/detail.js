import {
  LOAD_DETAIL_FAILURE,
  LOAD_DETAIL_REQUEST,
  LOAD_DETAIL_SUCCESS,
  SET_PAYBACK_QUANTITY,
  LOAD_STORE_INFO_FAILURE,
  LOAD_STORE_INFO_REQUEST,
  LOAD_STORE_INFO_SUCCESS,
  RESET_VALUE,
  LOAD_PRODUCT_DETAIL_FAILURE,
  LOAD_PRODUCT_DETAIL_REQUEST,
  LOAD_PRODUCT_DETAIL_SUCCESS,
  LOAD_HISTORY_DETAIL_FAILURE,
  LOAD_HISTORY_DETAIL_REQUEST,
  LOAD_HISTORY_DETAIL_SUCCESS,
  RETURN_PRODUCT_FAILURE,
  RETURN_PRODUCT_REQUEST,
  RETURN_PRODUCT_SUCCESS
} from '../actions/detail';
import { ProductBill, Store } from '../models';

const INITIAL_STATE = {
  products: [],
  histories: [],
  totalProduct: 0,
  totalHistory: 0,
  pageSize: 0,
  store: Store.map({}),
  skipProduct: 0,
  skipHistory: 0,
  loading: false,
  totalQuantity: 0,
  totalPrice: 0,
  tempData: ''
};

export default (state = INITIAL_STATE, action) => {
  let products;
  let histories;
  switch (action.type) {
    case LOAD_DETAIL_FAILURE:
      return {
        ...state,
        loading: false
      };
    case LOAD_DETAIL_REQUEST:
      return {
        ...state,
        loading: true
      };
    case LOAD_STORE_INFO_REQUEST:
      return {
        ...state,
        loading: true
      };
    case LOAD_STORE_INFO_FAILURE:
      return {
        ...state,
        loading: false
      };
    case LOAD_DETAIL_SUCCESS:
      return {
        ...state,
        products: [...state.products, ...action.payload.productList.products],
        totalProduct: action.payload.productList.total,
        histories: [...state.histories, ...action.payload.historyList.histories],
        totalHistory: action.payload.historyList.total,
        pageSize: state.pageSize + 20,
        loading: false
      };
    case SET_PAYBACK_QUANTITY:
      return {
        ...state,
        products: state.products.map((item: ProductBill) => {
          if (item.id === action.payload.id) {
            return { ...item, paybackQuantity: action.payload.quantity };
          }
          return item;
        })
      };
    case RESET_VALUE:
      return { ...INITIAL_STATE };
    case LOAD_STORE_INFO_SUCCESS:
      return {
        ...state,
        store: Store.map(action.payload)
      };
    case LOAD_PRODUCT_DETAIL_FAILURE:
      return { ...state, loading: false };
    case LOAD_PRODUCT_DETAIL_REQUEST:
      return { ...state, loading: true };
    case LOAD_PRODUCT_DETAIL_SUCCESS:
      products = action.payload.isContinue
        ? [...state.products, ...action.payload.products]
        : action.payload.products;
      return {
        ...state,
        products,
        skipProduct: action.payload.skip + 20,
        totalProduct: action.payload.total,
        loading: false
      };
    case LOAD_HISTORY_DETAIL_FAILURE:
      return {
        ...state,
        loading: false
      };
    case LOAD_HISTORY_DETAIL_REQUEST:
      return {
        ...state,
        loading: true
      };
    case LOAD_HISTORY_DETAIL_SUCCESS: {
      histories = action.payload.isContinue
        ? [...state.histories, ...action.payload.histories]
        : action.payload.histories;
      return {
        ...state,
        histories,
        totalHistory: action.payload.total,
        skipHistory: action.payload.skip + 20,
        totalQuantity: action.payload.totalQuantity,
        totalPrice: action.payload.totalPrice,
        loading: false
      };
    }
    case RETURN_PRODUCT_REQUEST:
      return { ...state, loading: true };
    case RETURN_PRODUCT_FAILURE:
      return { ...state, loading: false };
    case RETURN_PRODUCT_SUCCESS:
      return { ...state, loading: false, tempData: action.payload };
    default:
      return state;
  }
};
