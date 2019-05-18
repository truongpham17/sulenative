import { ProductBill } from '../models';
import { query } from '../services/api';
import { ENDPOINTS, METHODS } from '../constants/api';
import LOAD_NUMBER from '../utils/System';

export const SET_IS_SELL = 'set-type';
export const SET_SELL_QUANTITY = 'set-product-quantity';
export const SET_CURRENT_PRODUCT_BILLS = 'set-current-product-bill';
export const SET_PRODUCT_BILL = 'set-product-bill';
export const SET_PRODUCT_RETURN = 'set-product-return';

export const SET_OTHER_COST = 'set-other-cost';

export const REMOVE_PRODUCT_BILL = 'remove-product-bill';
export const SET_DISCOUNT = 'set-discount';
export const CLOSE_BILL = 'close-bill';

export const SUBMIT_BILL_REQUEST = 'submit-bill';
export const SUBMIT_BILL_SUCCESS = 'submit-bill-success';
export const SUBMIT_BILL_FAILURE = 'submit-bill-failure';

export const LOAD_PRODUCT_REQUEST = 'load-product-request';
export const LOAD_PRODUCT_SUCCESS = 'load-product-success';
export const LOAD_PRODUCT_FAILURE = 'load-product-failure';

export const LOAD_NEW_STORE = 'load-new-store';

export function setIsSell(data) {
  return {
    type: SET_IS_SELL,
    payload: data
  };
}

export function setQuantity(data: { id: string, value: number }) {
  return {
    type: SET_SELL_QUANTITY,
    payload: data
  };
}

export function setCurrentProductBills(data) {
  return {
    type: SET_CURRENT_PRODUCT_BILLS,
    payload: data
  };
}

export function setProductBill(data: ProductBill) {
  return {
    type: SET_PRODUCT_BILL,
    payload: data
  };
}

export function setProductReturn(data: ProductBill) {
  return {
    type: SET_PRODUCT_RETURN,
    payload: data
  };
}

// type  = BILL || IMPORT
export function loadStoreProduct(
  data = { id: '', skip: 0, limit: LOAD_NUMBER, isContinue: false },
  callback = {}
) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_PRODUCT_REQUEST, payload: { firstLoading: data.skip === 0 } });
      const result = await query({
        endpoint: `${ENDPOINTS.store}/${data.id}/products?skip=${data.skip}&limit=${LOAD_NUMBER}`
      });
      if (result.status === 200) {
        dispatch({
          type: LOAD_PRODUCT_SUCCESS,
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
        dispatch({ type: LOAD_PRODUCT_FAILURE });
        if (callback.failure) {
          callback.failure();
        }
      }
    } catch (err) {
      dispatch({ type: LOAD_PRODUCT_FAILURE, payload: err });
      if (callback.failure) {
        callback.failure();
      }
    }
  };
}

export function removeProductBill(id: string) {
  return {
    type: REMOVE_PRODUCT_BILL,
    payload: id
  };
}

export function setDiscount(data: { id: string, value: number }) {
  return {
    type: SET_DISCOUNT,
    payload: data
  };
}

export function closeBill() {
  return {
    type: CLOSE_BILL
  };
}

export function loadNewStore() {
  return {
    type: LOAD_NEW_STORE
  };
}

export function setOtherCost(cost) {
  let costValue = '0';

  if (!cost || cost === '') {
    costValue = '0';
  } else if (!isNaN(cost)) {
    costValue = `${parseInt(cost, 10)}`;
  }
  return {
    type: SET_OTHER_COST,
    payload: costValue
  };
}

export function submitBill(data, callback: {}) {
  return async dispatch => {
    try {
      dispatch({
        type: SUBMIT_BILL_REQUEST
      });
      const result = await query({
        endpoint: ENDPOINTS.bill,
        data,
        method: METHODS.post
      });
      if (result.status === 201) {
        if (callback.success) {
          callback.success();
        }
        dispatch({
          type: SUBMIT_BILL_SUCCESS,
          payload: result.data
        });
      } else {
        if (callback.failure) {
          callback.failure();
        }
        dispatch({
          type: SUBMIT_BILL_FAILURE
        });
      }
    } catch (err) {
      if (callback.failure) {
        callback.failure();
      }
      dispatch({
        type: SUBMIT_BILL_FAILURE,
        payload: err
      });
    }
  };
}
