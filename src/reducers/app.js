import { SET_DIALOG_STATUS } from '../actions/app';

const INITIAL_STATE = {
  showDialog: false,
  dialogType: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_DIALOG_STATUS:
      return {
        showDialog: action.payload.showDialog,
        dialogType: action.payload.dialogType
      };
    default:
      return { ...state };
  }
};
