import { query } from '../services/api';
import { ENDPOINTS } from '../constants/api';
import { Bill } from '../models';

export const LOAD_BILL_HISTORY_REQUEST = 'load-bill-history-request';
export const LOAD_BILL_HISTORY_SUCCESS = 'load-bill-history-success';
export const LOAD_BILL_HISTORY_FAILURE = 'load-bill-history-failure';
export const SET_CURRENT_BILL = 'set-current-bill';

export const LOAD_LIST_BILL_REQUEST = 'load-list-bill-request';
export const LOAD_LIST_BILL_SUCCESS = 'load-list-bill-success';
export const LOAD_LIST_BILL_FAILURE = 'load-list-bill-failure';

export const LOAD_BILL_DETAIL_REQUEST = 'load-bill-detail-request';
export const LOAD_BILL_DETAIL_SUCCESS = 'load-bill-detail-success';
export const LOAD_BILL_DETAIL_FAILURE = 'load-bill-detail-failure';

export function loadListBill(data = { skip: 0, isContinue: false }, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_LIST_BILL_REQUEST });
      let url = '';
      if (data.isSearchByName) {
        url = `${ENDPOINTS.bill}?customer=${data.search}`;
      } else {
        url = !data.search
          ? `${ENDPOINTS.bill}?skip=${data.skip}&limit=20`
          : `${ENDPOINTS.bill}?search=${data.search}`;
      }

      const result = await query({
        endpoint: url
      });
      if (result.status === 200) {
        if (callback.success) {
          callback.success();
        }
        dispatch({
          type: LOAD_LIST_BILL_SUCCESS,
          payload: {
            list: result.data.list.map(item => Bill.map(item)),
            total: result.data.total,
            skip: data.skip,
            isContinue: data.isContinue
          }
        });
      } else {
        if (callback.failure) {
          callback.failure();
        }
        dispatch({
          type: LOAD_LIST_BILL_FAILURE
        });
      }
    } catch (err) {
      if (callback.failure) {
        callback.failure();
      }
      dispatch({
        type: LOAD_LIST_BILL_FAILURE
      });
    }
  };
}

export function loadBillDetail(id, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_BILL_DETAIL_REQUEST });
      const result = await query({
        endpoint: `${ENDPOINTS.bill}/${id}`
      });
      if (result.status === 200) {
        if (callback.success) {
          callback.success();
        }
        dispatch({
          type: LOAD_BILL_DETAIL_SUCCESS,
          payload: result.data
        });
      } else {
        dispatch({
          type: LOAD_BILL_DETAIL_FAILURE
        });
        if (callback.failure) {
          callback.failure();
        }
      }
    } catch (err) {
      if (callback.failure) {
        callback.failure();
      }
      dispatch({
        type: LOAD_BILL_DETAIL_FAILURE
      });
    }
  };
}

export function setCurrentBill(id) {
  return {
    type: SET_CURRENT_BILL,
    payload: id
  };
}
