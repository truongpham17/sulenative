import { query } from '../services/api';
import { ENDPOINTS, METHODS } from '../constants/api';
import LOAD_NUMBER from '../utils/System';

export const ADD_STORE_REQUEST = 'set-current-store-request';
export const ADD_STORE_SUCCESS = 'set-current-store-success';
export const ADD_STORE_FAILURE = 'set-current-store-failure';

export const LOAD_STORE_REQUEST = 'load-store';
export const LOAD_STORE_SUCCESS = 'load-store-success';
export const LOAD_STORE_FAILURE = 'load-store-failure';

export const UPDATE_STORE_REQUEST = 'update-store';
export const UPDATE_STORE_SUCCESS = 'update-store-success';
export const UPDATE_STORE_FAILURE = 'update-store-failure';

export const IMPORT_PRODUCT_REQUEST = 'import-product-request';
export const IMPORT_PRODUCT_SUCCESS = 'import-product-success';
export const IMPORT_PRODUCT_FAILURE = 'import-product-failure';

export const SET_CURRENT_STORE = 'set-current-store';

export const LOAD_HISTORY_REQUEST = 'load-history-request';
export const LOAD_HISTORY_SUCCESS = 'load-history-success';
export const LOAD_HISTORY_FAILURE = 'load-history-failure';

export const LOAD_DEBT_STORE_REQUEST = 'load-debt-store-request';
export const LOAD_DEBT_STORE_SUCCESS = 'load-debt-store-success';
export const LOAD_DEBT_STORE_FAILURE = 'load-debt-store-failure';

export function addStore(data, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: ADD_STORE_REQUEST });
      const result = await query({
        data,
        endpoint: ENDPOINTS.store,
        method: METHODS.post
      });
      if (result.status === 201) {
        if (callback.success) {
          callback.success();
        }
        dispatch({ type: ADD_STORE_SUCCESS, payload: result.data });
      } else {
        if (callback.failure) {
          callback.failure();
        }
        dispatch({ type: ADD_STORE_FAILURE });
      }
    } catch (err) {
      if (callback.failure) {
        callback.failure();
      }
      dispatch({ type: ADD_STORE_FAILURE, payload: err });
    }
  };
}

export function loadStore(callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_STORE_REQUEST });
      const result = await query({ endpoint: ENDPOINTS.store });
      if (result.status === 200) {
        dispatch({ type: LOAD_STORE_SUCCESS, payload: result.data.list });
        if (callback.success) {
          const defaultValue = result.data.list.find(item => item.isDefault);
          if (defaultValue) {
            callback.success(defaultValue._id);
          }
        }
      } else {
        if (callback.failure) {
          callback.failure();
        }
        dispatch({ type: LOAD_STORE_FAILURE });
      }
    } catch (err) {
      if (callback.failure) {
        callback.failure();
      }
      dispatch({ type: LOAD_STORE_FAILURE, payload: err });
    }
  };
}

export function loadDebtStore() {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_DEBT_STORE_REQUEST });
      const result = await query({ endpoint: `${ENDPOINTS.store}?isDebt=true` });
      if (result.status === 200) {
        dispatch({ type: LOAD_DEBT_STORE_SUCCESS, payload: result.data.list });
      } else {
        dispatch({ type: LOAD_DEBT_STORE_FAILURE });
      }
    } catch (err) {
      dispatch({ type: LOAD_DEBT_STORE_FAILURE, payload: err });
    }
  };
}

export function updateStore(data: { id: string, name: string, debt: string }, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: UPDATE_STORE_REQUEST });
      const result = await query({
        endpoint: `${ENDPOINTS.store}/${data.id}`,
        data: { name: data.name, debt: data.debt },
        method: METHODS.patch
      });
      if (result.status === 200) {
        if (callback.success) {
          callback.success();
        }
        dispatch({ type: UPDATE_STORE_SUCCESS, payload: result.data });
      } else {
        if (callback.failure) {
          callback.failure();
        }
        dispatch({ type: UPDATE_STORE_FAILURE });
      }
    } catch (err) {
      if (callback.failure) {
        callback.failure();
      }
      dispatch({ type: UPDATE_STORE_FAILURE, payload: err });
    }
  };
}

export function setCurrentStore(data: string) {
  return {
    type: SET_CURRENT_STORE,
    payload: data
  };
}

export function importProduct(data, callback) {
  return async dispatch => {
    try {
      dispatch({ type: IMPORT_PRODUCT_REQUEST });
      const result = await query({
        endpoint: ENDPOINTS.importStore,
        method: METHODS.post,
        data
      });
      if (result.status === 200) {
        if (callback.success) {
          callback.success();
        }
        console.log('store new load: ', result.data);
        dispatch({ type: IMPORT_PRODUCT_SUCCESS, payload: result.data });
      } else {
        if (callback.failure) {
          callback.failure();
        }
        dispatch({ type: IMPORT_PRODUCT_FAILURE });
      }
    } catch (err) {
      if (callback.failure) {
        callback.failure();
      }
      dispatch({ type: IMPORT_PRODUCT_FAILURE, payload: err });
    }
  };
}
export function loadStoreHistory(data = { id: '', skip: 0, limit: LOAD_NUMBER }, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_HISTORY_REQUEST });
      const result = await query({
        endpoint: `${ENDPOINTS.store}/${data.id}/history?skip=${data.skip}&limit=${data.limit}`
      });
      if (result.status === 200) {
        dispatch({
          type: LOAD_HISTORY_SUCCESS,
          payload: { list: result.data.list, total: result.data.total }
        });
        if (callback.success) {
          callback.success();
        }
      } else {
        dispatch({ type: LOAD_HISTORY_FAILURE });
        if (callback.failure) {
          callback.failure();
        }
      }
    } catch (err) {
      dispatch({ type: LOAD_HISTORY_FAILURE, payload: err });
      if (callback.failure) {
        callback.failure();
      }
    }
  };
}
