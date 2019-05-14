export const SET_PRINTER_DEVICE = 'set-printer-device';

export function setPrinterDevice(data) {
  return {
    type: SET_PRINTER_DEVICE,
    payload: data // url & name
  };
}
