import { ENDPOINTS, METHODS } from '../constants/api';
import { query } from '../services/api';
import { ProductBill } from '../models';

export const LOAD_DETAIL_REQUEST = 'load-detail-request';
export const LOAD_DETAIL_SUCCESS = 'load-detail-success';
export const LOAD_DETAIL_FAILURE = 'load-detail-failure';
export const SET_PAYBACK_QUANTITY = 'set-payback-quantity';
export const RESET_VALUE = 'reset-value';

export const LOAD_STORE_INFO_REQUEST = 'load-store-info-request';
export const LOAD_STORE_INFO_SUCCESS = 'load-store-info-success';
export const LOAD_STORE_INFO_FAILURE = 'load-store-info-failure';

export const LOAD_PRODUCT_DETAIL_REQUEST = 'load-product-detail-request';
export const LOAD_PRODUCT_DETAIL_SUCCESS = 'load-product-detail-success';
export const LOAD_PRODUCT_DETAIL_FAILURE = 'load-product-detail-failure';

export const LOAD_HISTORY_DETAIL_REQUEST = 'load-store-history-request';
export const LOAD_HISTORY_DETAIL_SUCCESS = 'load-store-history-success';
export const LOAD_HISTORY_DETAIL_FAILURE = 'load-store-history-failure';

export const RETURN_PRODUCT_REQUEST = 'return-product-request';
export const RETURN_PRODUCT_SUCCESS = 'return-product-success';
export const RETURN_PRODUCT_FAILURE = 'return-product-failure';

export function loadStoreProductDetail(
  data = { id: '', skip: 0, limit: 20, isContinue: false },
  callback = {}
) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_PRODUCT_DETAIL_REQUEST });
      const result = await query({
        endpoint: `${ENDPOINTS.store}/${data.id}/products?skip=${data.skip}&limit=${20}`
      });
      console.log(result.data);
      if (result.status === 200) {
        dispatch({
          type: LOAD_PRODUCT_DETAIL_SUCCESS,
          payload: {
            products: result.data.list.map(item =>
              ProductBill.map({ product: item, id: item._id })
            ),
            total: result.data.total,
            skip: data.skip,
            id: data.id,
            isContinue: data.isContinue
          }
        });
        if (callback.success) {
          callback.success();
        }
      } else {
        dispatch({ type: LOAD_PRODUCT_DETAIL_FAILURE });
        if (callback.failure) {
          callback.failure();
        }
      }
    } catch (err) {
      dispatch({ type: LOAD_PRODUCT_DETAIL_FAILURE, payload: err });
      if (callback.failure) {
        callback.failure();
      }
    }
  };
}

export function loadStoreHistoryDetail(
  data = { id: '', skip: 0, limit: 20, isContinue: false },
  callback = {}
) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_HISTORY_DETAIL_REQUEST });
      const result = await query({
        endpoint: `${ENDPOINTS.store}/${data.id}/history?skip=${data.skip}&limit=${20}`
      });
      if (result.status === 200) {
        dispatch({
          type: LOAD_HISTORY_DETAIL_SUCCESS,
          payload: {
            histories: result.data.list,
            total: result.data.total,
            skip: data.skip,
            id: data.id,
            isContinue: data.isContinue,
            totalQuantity: result.data.totalQuantity,
            totalPrice: result.data.totalPrice
          }
        });
        if (callback.success) {
          callback.success();
        }
      } else {
        dispatch({ type: LOAD_HISTORY_DETAIL_FAILURE });
        if (callback.failure) {
          callback.failure();
        }
      }
    } catch (err) {
      dispatch({ type: LOAD_HISTORY_DETAIL_FAILURE, payload: err });
      if (callback.failure) {
        callback.failure();
      }
    }
  };
}

export function loadStoreInfo(id, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_STORE_INFO_REQUEST });
      const result = await query({
        endpoint: `${ENDPOINTS.store}/${id}`
      });

      if (result.status === 200) {
        dispatch({
          type: LOAD_STORE_INFO_SUCCESS,
          payload: result.data
        });
        if (callback.success) {
          callback.success();
        }
      } else {
        dispatch({ type: LOAD_STORE_INFO_FAILURE });
        if (callback.failure) {
          callback.failure();
        }
      }
    } catch (err) {
      dispatch({ type: LOAD_STORE_INFO_FAILURE, payload: err });
      if (callback.failure) {
        callback.failure();
      }
    }
  };
}

export function setPaybackQuantity(data: { quantity: number, id: string }) {
  return {
    type: SET_PAYBACK_QUANTITY,
    payload: data
  };
}

export function resetValue() {
  return {
    type: RESET_VALUE
  };
}

export function returnProduct(data, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: RETURN_PRODUCT_REQUEST });
      const result = await query({
        endpoint: `${ENDPOINTS.bill}/return`,
        method: METHODS.post,
        data
      });
      if (result.status === 201) {
        dispatch({
          type: RETURN_PRODUCT_SUCCESS,
          payload: result.data
        });
        if (callback.success) {
          callback.success();
        }
      } else {
        dispatch({
          type: RETURN_PRODUCT_FAILURE
        });
        if (callback.failure) {
          callback.failure();
        }
      }
    } catch (ex) {
      dispatch({
        type: RETURN_PRODUCT_FAILURE
      });
      if (callback.failure) {
        callback.failure();
      }
    }
  };
}
