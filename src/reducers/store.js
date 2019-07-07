import {
  ADD_STORE_SUCCESS,
  LOAD_STORE_SUCCESS,
  UPDATE_STORE_SUCCESS,
  SET_CURRENT_STORE,
  LOAD_HISTORY_SUCCESS,
  IMPORT_PRODUCT_SUCCESS,
  LOAD_STORE_INFO_SUCCESS,
  LOAD_DEBT_STORE_SUCCESS
} from '../actions';
import { Store } from '../models';

const INITIAL_STATE = {
  currentStore: { id: '' },
  error: '',
  stores: [],
  loading: false,
  loadingStore: false,
  defaultStore: Store.map({}),
  debtStore: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_STORE_SUCCESS:
      const defaultStore = action.payload.find(item => item.isDefault);
      return {
        ...state,
        stores: [Store.map(defaultStore), ...action.payload.map(value => Store.map(value)).filter(item => item.id !== defaultStore._id)],
        currentStore: (defaultStore && Store.map(defaultStore)) || { id: '' },
        defaultStore: Store.map(defaultStore)
      };
    case LOAD_DEBT_STORE_SUCCESS:
      return {
        ...state,
        debtStore: action.payload.map(value => Store.map(value))
      };
    case ADD_STORE_SUCCESS:
      return {
        ...state,
        currentStore: Store.map(action.payload),
        stores: [...state.stores, Store.map(action.payload)],
      };
    case UPDATE_STORE_SUCCESS:
      return {
        ...state,
        stores: state.stores.map(item => item.id === action.payload._id ? Store.map(action.payload) : item),
      };
    case SET_CURRENT_STORE:
      return {
        ...state,
        currentStore: state.stores.find(item => item.id === action.payload)
      };
    case LOAD_HISTORY_SUCCESS:
      return {
        ...state,
        currentStore: Store.map({
          ...state.currentStore,
          histories: [...state.currentStore.histories, ...action.payload.list],
          totalHistory: action.payload.total
        }),
      };
    case IMPORT_PRODUCT_SUCCESS:
      console.log('come here');
      const stores = state.stores.map(item => {
        if (item.id === action.payload._id) {
          return Store.map(action.payload);
        }
        return item;
      });
      return {
        ...state,
        stores,
        currentStore: Store.map(action.payload)
        // loading: false
      };

    case LOAD_STORE_INFO_SUCCESS:
      return {
        ...state,
        currentStore: Store.map(action.payload)
      };
    default:
      return { ...state };
  }
};
