import { Product } from '../models';
import { ENDPOINTS } from '../constants/api';
import { query } from '../services/api';

export const LOAD_PRODUCT_IMPORT_REQUEST = 'load-product-import-request';
export const LOAD_PRODUCT_IMPORT_SUCCESS = 'load-product-import-success';
export const LOAD_PRODUCT_IMPORT_FAILURE = 'load-product-import-failure';

export const REMOVE_PRODUCT_ITEM = 'remove-product-item';

export function loadStoreProductImport(
  data = { id: '', skip: 0, limit: 20, isContinue: false },
  callback = {}
) {
  return async dispatch => {
    try {
      dispatch({ type: LOAD_PRODUCT_IMPORT_REQUEST });
      const result = await query({
        endpoint: `${ENDPOINTS.store}/${data.id}/products?skip=${data.skip}&limit=${20}`
      });
      console.log(result.data);
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
