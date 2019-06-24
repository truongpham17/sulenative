import { Product } from '../models';
import { ENDPOINTS } from '../constants/api';
import { query } from '../services/api';
import LOAD_NUMBER from '../utils/System';

export const LOAD_PRODUCT_IMPORT_REQUEST = 'load-product-import-request';
export const LOAD_PRODUCT_IMPORT_SUCCESS = 'load-product-import-success';
export const LOAD_PRODUCT_IMPORT_FAILURE = 'load-product-import-failure';

export const EASE_IMPORT_DATA = 'ease-import-data';

export const SET_DEBT = 'set-debt';

export const SET_NOTE = 'set-note';

export const REMOVE_PRODUCT_ITEM = 'remove-product-item';

export const ADD_PRODUCT_IMPORT = 'add-product-import';

export function addProductImport(data: {quantity: Number, exportPrice: Number, importPrice: Number}) {
  return {
    type: ADD_PRODUCT_IMPORT,
    payload: data
  };
}

export function setDebt(value: String) {
  return {
    type: SET_DEBT,
    payload: value
  };
}


export function loadStoreProductImport(
  data = { id: '', skip: 0, limit: LOAD_NUMBER, isContinue: false },
  callback = {}
) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_PRODUCT_IMPORT_REQUEST });
      const result = await query({
        endpoint: `${ENDPOINTS.store}/${data.id}/products?skip=${data.skip}&limit=${LOAD_NUMBER}`
      });
      if (result.status === 200) {
        dispatch({
          type: LOAD_PRODUCT_IMPORT_SUCCESS,
          payload: {
            products: result.data.list.map(item => Product.mapWithoutQuantity(item)),
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
        dispatch({ type: LOAD_PRODUCT_IMPORT_FAILURE });
        if (callback.failure) {
          callback.failure();
        }
      }
    } catch (err) {
      dispatch({ type: LOAD_PRODUCT_IMPORT_FAILURE, payload: err });
      if (callback.failure) {
        callback.failure();
      }
    }
  };
}

export function removeProductItem() {
  return {
    type: REMOVE_PRODUCT_ITEM
  };
}

export function setNote(note: String) {
  return {
    type: SET_NOTE,
    payload: note
  };
}

export function easeImportData() {
  return {
    type: EASE_IMPORT_DATA
  };
}
