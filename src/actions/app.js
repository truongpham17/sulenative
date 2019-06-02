export const SET_DIALOG_STATUS = 'set-dialog-status';
export const SET_LOADING = 'set-app-loading';
export function setDialogStatus(data) {
  return {
    type: SET_DIALOG_STATUS,
    payload: data
  };
}
export function setLoading(value) {
  return {
    type: SET_LOADING,
    payload: value
  };
}
