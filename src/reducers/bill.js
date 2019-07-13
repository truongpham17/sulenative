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
  SET_CUSTOMER,
  SET_SPECIAL_DISCOUNT
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
  customer: {},
  specialDiscount: 0,
};

function calculateTotalValue(bills, specialDiscount) {
  let totalPrice = 0;
  let totalQuantity = 0;
  // let totalDiscount = 0;
  bills.forEach(item => {
    const isSell = item.isSell ? 1 : -1;
    const discount = item.discount + specialDiscount;
    totalPrice += item.quantity * (item.exportPrice - discount) * isSell;
    totalQuantity += item.isSell ? item.quantity : 0;
  });
  return {
    totalPrice,
    // minus discount
    totalQuantity,
    // totalDiscount
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
      data = calculateTotalValue(bills, state.specialDiscount);
      return {
        ...state,
        bills,
        ...data
      };

    case REMOVE_PRODUCT_BILL:
      bills = state.bills;
      bills.splice(action.payload, 1);
      data = calculateTotalValue(bills, state.specialDiscount);
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
        customer: {},
        specialDiscount: 0
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
          data = calculateTotalValue(productBills, state.specialDiscount);

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
    case SET_SPECIAL_DISCOUNT:
      data = calculateTotalValue(state.bills, action.payload);
    return {
      ...state,
      specialDiscount: action.payload,
      ...data
      // bills: state.bills.map((item) => ({
      //   ...item, discount: item.discount + action.payload
      // }))
    };


    default:
      return state;
  }
};
