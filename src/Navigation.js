import React from 'react';
import { View, NativeEventEmitter } from 'react-native';
import { createSwitchNavigator, createAppContainer, createDrawerNavigator, createStackNavigator, } from 'react-navigation';
import { connect } from 'react-redux';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { AlertInfo, Alert } from './utils/Dialog';
import { setDialogStatus, setPrinterConnect, setLoading, setPrinterDevice } from './actions';
import { LoadingModal, DialogStatus } from './components';
import NavigationService from './NavigationService';
import {
  HistoryScreen,
  ImportScreen,
  LoginScreen,
  SaleScreen,
  StatictisScreen,
  SupplyScreen,
  AuthScreen,
  ProfileScreen,
  SetupPrinter,
  PayDebt,
  ScanningBarCode,
  // FramePrice
} from './screens';
import { PanelNavigator } from './components/PanelNavigator';

const MainNavigation = createDrawerNavigator(
  {
    SaleScreen,
    ImportScreen,
    SupplyScreen,
    HistoryScreen,
    ProfileScreen,
    StatictisScreen,
    PayDebt,
    SetupPrinter,
    // FramePrice
  },
  {
    contentComponent: PanelNavigator,
    drawerWidth: 300
  }
);

// for product
const StackNavigation = createStackNavigator({
  MainNavigation,
  ScanningBarCode
}, {
    headerMode: 'none',

  });

// for testing
// const StackNavigation = createStackNavigator({
//   MainNavigation,
//   ScanningBarCode
// }, {
//     headerMode: 'none',

//   });


const AppNavigation = createSwitchNavigator(
  {
    AuthScreen,
    SetupPrinter,
    LoginScreen,
    StackNavigation,
  },
  {
    initialRouteName: 'AuthScreen'
  }
);

const MainApp = createAppContainer(AppNavigation);

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.listener = [];
  }


  componentDidMount = async () => {
    const { setPrinterConnect, setDialogStatus, setPrinterDevice } = this.props;
    const bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
    // add listener
    this.listener.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
      () => {
        console.log('already pair');
        setPrinterConnect(true);
      }));

    this.listener.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
      Alert('Mất kết nối với máy in', 'Vào cài đặt?', 'Đóng', 'Cài đặt', () => NavigationService.navigate('SetupPrinter'));
      setPrinterConnect(false);
      setLoading(false);
      setDialogStatus({ showDialog: false });
      console.log('disconnected!');
    }));

    this.listener.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTED, (rps) => {
      setPrinterConnect(true);
      console.log('connected!!');
      setLoading(false);
      setPrinterDevice({ url: rps.address });
      setDialogStatus({ showDialog: false });
      AlertInfo('Kết nối với máy in thành công!', '', () => NavigationService.navigate('MainNavigation'));
    }));
  }

  componentWillUnmount() {
    for (let i = 0; i < this.listener.length; i++) {
      this.listener[i].remove();
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <DialogStatus
          visible={this.props.showDialog}
          type={this.props.dialogType}
          onBackdropPress={() => this.props.setDialogStatus({ showDialog: false })}
        />
        <LoadingModal visible={this.props.loading} />
        <MainApp
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    showDialog: state.app.showDialog,
    dialogType: state.app.dialogType,
    loading: state.app.loading,
    printerURL: state.user.printerURL,
    setPrinterDevice
  }),
  { setDialogStatus, setPrinterConnect }
)(Application);
