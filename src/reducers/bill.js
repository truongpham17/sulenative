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
  SET_OTHER_COST,
  ADD_BILL_PRODUCT
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
  otherCost: '0',
  productNeedToSave: []
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
  let productBills = [];
  let data = {};
  let currentProductBills = [];

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
      updateProduct = state.productBills.find(
        item => item.id === action.payload.id && item.paybackQuantity === 0
      );

      currentProductBills = state.currentProductBills.map(item => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            soldQuantity: action.payload.soldQuantity
          };
        }
        return item;
      });

      productBills = updateProduct
        ? state.productBills.map(item => {
            if (item.id === action.payload.id && item.paybackQuantity === 0) {
              return { ...action.payload, paybackQuantity: 0 };
            }
            return item;
          })
        : [...state.productBills, { ...action.payload, paybackQuantity: 0 }];
      data = calculateTotalValue(productBills, state.otherCost);

      return {
        ...state,
        currentProductBills,
        productBills: productBills.filter(item => item.soldQuantity > 0 || item.paybackQuantity > 0),
        ...data
      };

    case SET_PRODUCT_RETURN:
      updateProduct = state.productBills.find(
        item => item.id === action.payload.id && item.soldQuantity === 0
      );
      currentProductBills = state.currentProductBills.map(item => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            paybackQuantity: action.payload.paybackQuantity
          };
        }
        return item;
      });
      productBills = updateProduct
        ? state.productBills.map(item => {
            if (item.id === action.payload.id && item.soldQuantity === 0) {
              return { ...action.payload, soldQuantity: 0 };
            }
            return item;
          })
        : [...state.productBills, { ...action.payload, soldQuantity: 0 }];
      data = calculateTotalValue(productBills, state.otherCost);
      return {
        ...state,
        productBills: productBills.filter(item => item.paybackQuantity > 0 || item.soldQuantity > 0),
        ...data,
        currentProductBills
      };
    case REMOVE_PRODUCT_BILL:
      productBills = state.productBills.filter(item => item.id !== action.payload);

      currentProductBills = state.currentProductBills.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            soldQuantity: 0,
            paybackQuantity: 0
          };
        }
        return item;
      });

      data = calculateTotalValue(productBills, state.otherCost);
      return {
        ...state,
        productBills,
        currentProductBills,
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
        otherCost: '0',
        currentProductBills: []
      };
    case SUBMIT_BILL_SUCCESS:
      data = calculateTotalValue([], 0);
      return {
        ...state
        // isSell: true,
        // productBills: [],
        // ...data,
        // otherCost: '0'
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
      // add new products
      if (action.payload.isContinue) {
        return {
          ...state,
          currentProductBills: [...state.currentProductBills, ...action.payload.products],
          skip: action.payload.skip + LOAD_NUMBER,
          loadingBill: false,
          firstLoading: false,
          loading: false
        };
      }

      productBills = action.payload.products.map(item => {
        let existProductSell = 0;
        let existProductPay = 0;
        state.productBills.forEach(bill => {
          if (bill.id === item.id && bill.soldQuantity > 0) {
            existProductSell = bill.soldQuantity;
          }
          if (bill.id === item.id && bill.paybackQuantity > 0) {
            existProductPay = bill.paybackQuantity;
          }
        });

        return { ...item, soldQuantity: existProductSell, paybackQuantity: existProductPay };
      });

      currentProductBills = action.payload.isDefaultStore ? [...state.productNeedToSave, ...productBills] : productBills;

      return {
        ...state,
        currentProductBills, // product have quantity
        total: action.payload.total,
        skip: action.payload.skip + LOAD_NUMBER,
        loadingBill: false,
        firstLoading: false,
        loading: false
      };

      case ADD_BILL_PRODUCT:
          productBills = [action.payload, ...state.productBills];
          currentProductBills = [action.payload, ...state.currentProductBills];
          data = calculateTotalValue(productBills, state.otherCost);

      return {
        ...state,
        currentProductBills,
        productBills,
        productNeedToSave: [action.payload, ...state.productNeedToSave],
        ...data
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
