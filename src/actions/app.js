export const SET_DIALOG_STATUS = 'set-dialog-status';
export function setDialogStatus(data) {
  return {
    type: SET_DIALOG_STATUS,
    payload: data
  };
}
