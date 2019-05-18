import {
  SET_IS_SELL,
  SET_SELL_QUANTITY,
  SET_PRODUCT_BILL,
  SET_PRODUCT_RETURN,
  REMOVE_PRODUCT_BILL,
  SET_DISCOUNT,
  CLOSE_BILL,
  SUBMIT_BILL_SUCCESS,
  LOAD_PRODUCT_FAILURE,
  LOAD_PRODUCT_REQUEST,
  LOAD_PRODUCT_SUCCESS,
  LOAD_NEW_STORE,
  SET_OTHER_COST
} from '../actions';
import LOAD_NUMBER from '../utils/System';

const INITIAL_STATE = {
  isSell: true,
  currentProductBills: [],
  productBills: [],
  loading: false,
  error: '',
  total: 0,
  loadingBill: false,
  firstLoading: true,
  skip: 0,
  totalPrice: 0,
  totalQuantity: 0,
  totalDiscount: 0,
  otherCost: '0'
};

function calculateTotalValue(products, otherCost) {
  let totalPrice = 0;
  let totalQuantity = 0;
  let totalDiscount = 0;
  products.forEach(item => {
    if (item.soldQuantity > 0) {
      totalPrice += item.soldQuantity * (item.product.exportPrice - item.discount);
      totalQuantity += item.soldQuantity;
    } else {
      totalPrice -= item.paybackQuantity * item.product.exportPrice;
    }
    totalDiscount += item.discount * item.soldQuantity;
  });
  if (!!otherCost && otherCost.length > 0) {
    totalPrice += parseInt(otherCost, 10);
  }
  return {
    totalPrice,
    totalQuantity,
    totalDiscount
  };
}

export default (state = INITIAL_STATE, action) => {
  let updateProduct;
  let productIds;
  let products;
  let soldoutProducts = [];
  let productBills = [];
  let data = {};
  switch (action.type) {
    case SET_IS_SELL:
      return {
        ...state,
        isSell: action.payload
      };
    case SET_SELL_QUANTITY:
      return {
        ...state,
        currentProductBills: state.currentProductBills.map(item => {
          if (item.id === action.payload.id) {
            if (state.isSell) {
              return { ...item, soldQuantity: action.payload.value };
            }
            return { ...item, paybackQuantity: action.payload.value };
          }
          return item;
        })
      };
    case SET_PRODUCT_BILL:
      updateProduct = false;
      state.productBills.forEach(item => {
        if (item.id === action.payload.id && !updateProduct) {
          updateProduct = true;
        }
      });
      productBills = updateProduct
        ? state.productBills.map(item => {
            if (item.id === action.payload.id) {
              return action.payload;
            }
            return item;
          })
        : [...state.productBills, action.payload];
      data = calculateTotalValue(productBills, state.otherCost);

      return {
        ...state,
        productBills,
        ...data
      };

    case SET_PRODUCT_RETURN:
      updateProduct = false;
      state.productBills.forEach(item => {
        if (item.id === action.payload.id && !updateProduct) {
          updateProduct = true;
        }
      });

      productBills = updateProduct
        ? state.productBills.map(item => {
            if (item.id === action.payload.id) {
              return action.payload;
            }
            return item;
          })
        : [...state.productBills, action.payload];
      data = calculateTotalValue(productBills, state.otherCost);
      return {
        ...state,
        productBills,
        ...data
      };
    case REMOVE_PRODUCT_BILL:
      productBills = state.productBills.filter(item => item.id !== action.payload);
      data = calculateTotalValue(productBills, state.otherCost);
      return {
        ...state,
        productBills,
        ...data
      };
    case SET_DISCOUNT:
      productBills = state.productBills.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, discount: action.payload.value };
        }
        return item;
      });
      data = calculateTotalValue(productBills, state.otherCost);
      return {
        ...state,
        productBills,
        ...data
      };
    case SET_OTHER_COST:
      data = calculateTotalValue(state.productBills, action.payload);
      return {
        ...state,
        ...data,
        otherCost: action.payload
      };
    case CLOSE_BILL:
      data = calculateTotalValue([], 0);
      return {
        ...state,
        productBills: [],
        ...data,
        otherCost: '0'
      };
    case SUBMIT_BILL_SUCCESS:
      data = calculateTotalValue([], 0);
      return {
        isSell: true,
        productBills: [],
        ...data
      };
    case LOAD_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        loadingBill: true,
        firstLoading: action.payload.firstLoading
      };
    case LOAD_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: 'Không thể tải!',
        loadingBill: false,
        firstLoading: false
      };
    case LOAD_PRODUCT_SUCCESS:
      // products already bought
      products = state.productBills.filter(
        item =>
          item.product.store.id === action.payload.id &&
          (item.soldQuantity > 0 || item.paybackQuantity > 0)
      );

      // id of products already bought
      productIds = products.map(item => item.id);

      // add new products
      if (action.payload.isContinue) {
        return {
          ...state,
          currentProductBills: [
            ...state.currentProductBills,
            ...action.payload.products.filter(item => !productIds.includes(item.id))
          ],
          skip: action.payload.skip + LOAD_NUMBER,
          loadingBill: false,
          firstLoading: false,
          loading: false
        };
      }

      // soldout product
      soldoutProducts = action.payload.products.filter(
        item => item.product.quantity === 0 && !productIds.includes(item.id)
      );
      soldoutProducts.forEach(item => {
        productIds.push(item.id);
      });
      return {
        ...state,
        currentProductBills: [
          ...products, // product already bought,
          ...action.payload.products // product have quantity
            .filter(item => !productIds.includes(item.id)),
          ...soldoutProducts // product sold out
        ],
        total: action.payload.total,
        skip: action.payload.skip + LOAD_NUMBER,
        loadingBill: false,
        firstLoading: false,
        loading: false
      };

    case LOAD_NEW_STORE:
      return {
        ...state,
        total: 0,
        skip: 0,
        currentProductBills: [],
        firstLoading: true
      };
    default:
      return state;
  }
};
