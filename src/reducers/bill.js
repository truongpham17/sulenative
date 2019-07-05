import {
  SET_IS_SELL,
  REMOVE_PRODUCT_BILL,
  SET_DISCOUNT,
  CLOSE_BILL,
  SUBMIT_BILL_SUCCESS,
  LOAD_PRODUCT_FAILURE,
  LOAD_PRODUCT_REQUEST,
  LOAD_PRODUCT_SUCCESS,
  LOAD_NEW_STORE,
  SET_OTHER_COST,
  ADD_BILL_PRODUCT,
  ADD_PRODUCT_BILL,
  SET_CUSTOMER
} from '../actions';
import LOAD_NUMBER from '../utils/System';

const INITIAL_STATE = {
  isSell: true,
  loading: false,
  error: '',
  total: 0,
  totalPrice: 0,
  totalQuantity: 0,
  totalDiscount: 0,
  otherCost: '0',
  bills: [],
  customer: {}
};

function calculateTotalValue(bills) {
  let totalPrice = 0;
  let totalQuantity = 0;
  let totalDiscount = 0;
  bills.forEach(item => {
    const isSell = item.isSell ? 1 : -1;
    if (item.discount) {
      totalDiscount += (item.discount || 0) * item.quantity; // remember to parse to int before add to reducer
    }
    totalPrice += item.quantity * item.exportPrice * isSell;
    totalQuantity += item.isSell ? item.quantity : 0;
  });
  return {
    totalPrice: totalPrice - totalDiscount,
    // minus discount
    totalQuantity,
    totalDiscount
  };
}

export default (state = INITIAL_STATE, action) => {
  let productBills = [];
  let data = {};
  let bills = [];
  let currentProductBills = [];

  switch (action.type) {
    case SET_IS_SELL:
      return {
        ...state,
        isSell: action.payload
      };
    case ADD_PRODUCT_BILL:
      bills = [...state.bills, action.payload];
      data = calculateTotalValue(bills);
      return {
        ...state,
        bills,
        ...data
      };

    case REMOVE_PRODUCT_BILL:
      bills = state.bills;
      bills.splice(action.payload, 1);
      data = calculateTotalValue(bills);
      return {
        ...state,
       bills: [...bills],
       ...data
      };
    case SET_DISCOUNT:
      return {
        ...state,
        bills: state.bills.map((item, idx) => {
          if (idx === action.payload.index) {
            return { ...item, discount: action.payload.value };
          }
          return item;
        })
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
        bills: [],
        ...data,
        otherCost: '0',
        currentProductBills: [],
        customer: {}
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
    case SET_CUSTOMER:
      return { ...state, customer: action.payload };
    default:
      return state;
  }
};
