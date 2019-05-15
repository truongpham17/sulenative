// import {
//   BluetoothManager,
//   BluetoothEscposPrinter,
//   BluetoothTscPrinter
//   //   Device
// } from 'react-native-bluetooth-escpos-printer';
// import { DeviceEventEmitter } from 'react-native';

// const BLUETOOTH_NOT_ENABLE = 'bluetooth-not-enable';
// const DEVICE_PAIR = 'device-pair';

// const connectToDevice = async () => {
//   const isBluetoothEnable = await BluetoothManager.isBluetoothEnabled();
//   if (!isBluetoothEnable) {
//     return {
//       status: BLUETOOTH_NOT_ENABLE
//     };
//   }

//   // add listener when trying to connect
//   DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
//     deviceAlreadPaired(rsp); // rsp.devices would returns the paired devices array in JSON string.
//   });
//   DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
//     deviceFoundEvent(rsp); // rsp.devices would returns the found device object in JSON string
//   });
// };

// const print = async () => {
//   const isBluetoothEnable = await BluetoothManager.isBluetoothEnabled();
//   if (!isBluetoothEnable) {
//     return {
//       status: BLUETOOTH_NOT_ENABLE
//     };
//   }

//   // add listener when trying to connect
//   DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, rsp => {
//     deviceAlreadPaired(rsp); // rsp.devices would returns the paired devices array in JSON string.
//   });
//   DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, rsp => {
//     deviceFoundEvent(rsp); // rsp.devices would returns the found device object in JSON string
//   });
// };

// export default print;
