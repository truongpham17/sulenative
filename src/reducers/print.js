import { SET_PRINTER_DEVICE } from '../actions';

const INITIAL_STATE = {
  printerURL: '',
  printerName: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_PRINTER_DEVICE:
      return {
        printerURL: action.payload.url,
        name: action.payload.name
      };
    default:
      return { ...state };
  }
};
