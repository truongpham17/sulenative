import {
  ADD_STORE_FAILURE,
  ADD_STORE_SUCCESS,
  ADD_STORE_REQUEST,
  LOAD_STORE_FAILURE,
  LOAD_STORE_REQUEST,
  LOAD_STORE_SUCCESS,
  UPDATE_STORE_FAILURE,
  UPDATE_STORE_REQUEST,
  UPDATE_STORE_SUCCESS,
  SET_CURRENT_STORE,
  LOAD_HISTORY_FAILURE,
  LOAD_HISTORY_REQUEST,
  LOAD_HISTORY_SUCCESS,
  IMPORT_PRODUCT_SUCCESS,
  IMPORT_PRODUCT_FAILURE,
  IMPORT_PRODUCT_REQUEST,
  LOAD_STORE_INFO_REQUEST,
  LOAD_STORE_INFO_FAILURE,
  LOAD_STORE_INFO_SUCCESS
} from '../actions';
import { Store } from '../models';

const INITIAL_STATE = {
  currentStore: { id: '' },
  error: '',
  stores: [],
  loading: false,
  loadingStore: false,
  firstLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_STORE_REQUEST:
      return { ...state, loading: true };
    case LOAD_STORE_REQUEST:
      return { ...state, loadingStore: true, loading: true };
    case UPDATE_STORE_REQUEST:
      return {
        ...state,
        loadingStore: true,
        loading: true
      };

    case ADD_STORE_FAILURE:
      return { ...state, loading: false };
    case LOAD_STORE_FAILURE:
      return { ...state, loadingStore: false, loading: false };
    case UPDATE_STORE_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case LOAD_STORE_SUCCESS:
      const defaultStore = action.payload.find(item => item.isDefault);
      return {
        ...state,
        loadingStore: false,
        stores: action.payload.map(value => Store.map(value)),
        firstLoading: false,
        loading: false,
        currentStore: (defaultStore && Store.map(defaultStore)) || { id: '' }
      };
    case ADD_STORE_SUCCESS:
      return {
        ...state,
        currentStore: Store.map(action.payload),
        stores: [...state.stores, Store.map(action.payload)],
        loading: false
      };
    case UPDATE_STORE_SUCCESS:
      return {
        ...state,
        loading: false,
        stores: state.stores.map((item: Store) => {
          if (item.id === action.payload._id) {
            return { ...item, name: action.payload.name, debt: action.payload.debt };
          }
          return item;
        }),
        currentStore: {
          ...state.currentStore,
          name: action.payload.name,
          debt: action.payload.debt
        }
      };
    case SET_CURRENT_STORE:
      return {
        ...state,
        currentStore: state.stores.find(item => item.id === action.payload)
      };
    case LOAD_HISTORY_REQUEST:
      return {
        ...state,
        loading: true
      };
    case LOAD_HISTORY_SUCCESS:
      return {
        ...state,
        currentStore: Store.map({
          ...state.currentStore,
          histories: [...state.currentStore.histories, ...action.payload.list],
          totalHistory: action.payload.total
        }),
        loading: false
      };
    case LOAD_HISTORY_FAILURE:
      return {
        ...state,
        loading: false
      };
    case IMPORT_PRODUCT_FAILURE:
      return {
        ...state
        // loading: false
      };
    case IMPORT_PRODUCT_REQUEST:
      return {
        ...state
        // loading: true
      };
    case IMPORT_PRODUCT_SUCCESS:
      const stores = state.stores.map(item => {
        if (item.id === action.payload.store) {
          return {
            ...item,
            totalImportProduct: item.totalImportProduct + action.payload.quantity,
            productQuantity: item.productQuantity + action.payload.quantity
          };
        }
        return item;
      });
      return {
        ...state,
        stores
        // loading: false
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

    case LOAD_STORE_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStore: Store.map(action.payload)
      };

    default:
      return { ...state };
  }
};
