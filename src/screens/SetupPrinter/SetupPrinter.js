import React from 'react';
import { FlatList, TouchableOpacity, Text, View, NativeEventEmitter } from 'react-native';
import { connect } from 'react-redux';

import { Icon } from 'react-native-elements';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { setLoading, setPrinterDevice, setPrinterConnect } from '../../actions';
import { Style } from '../../components';
import { AlertInfo } from '../../utils/Dialog';

class SetupPrinter extends React.PureComponent {
  state = {
    ips: []
  }
  componentDidMount() {
    const { navigation, printerURL } = this.props;
    this.focusListener = navigation.addListener('didFocus', this.scanningDevice);
    const bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
    this.listener = bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rps) => {
      let device = null;
      if (typeof (rps) === 'object') {
        device = rps.device;
      } else {
        device = JSON.parse(rps.device);
      }
      this.setState(state => ({ ips: [...state.ips, device] }));
      if (device.address === printerURL) {
        BluetoothManager.connect(printerURL);
      }
    });

    setTimeout(() => {
      if (this.state.ips.length === 0) {
        this.scanningDevice();
      }
    }, 3000);
  }

  componentWillUnmount() {
    this.listener.remove();
    this.focusListener.remove();
  }


  onSetupPrinterUrl = url => {
    const { setPrinterDevice } = this.props;
    console.log('try to connect to url: ');
    BluetoothManager.connect(url).then(() => { setPrinterDevice({ url }); this.props.navigation.navigate('MainNavigation'); });
  };

  scanningDevice = async () => {
    this.setState({ ips: [] });
    console.log('come here');
    // check whether enable bluetooth
    console.log('check is bluetooth enable');
    const isBluetoothEnable = await BluetoothManager.isBluetoothEnabled();
    console.log('result: ', isBluetoothEnable);
    if (!isBluetoothEnable) {
      AlertInfo('Bluetooth chưa được bật', 'Vui lòng bật bluetooth và thử lại');
      return;
    }
    console.log('scanning devices');
    await BluetoothManager.scanDevices();
    console.log('success fully scanning devices');
  }


  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
          <TouchableOpacity style={{ width: 40, height: 40 }} onPress={() => navigation.navigate('MainNavigation')}>
          <Icon
            name="x"
            type="feather"
            containerStyle={{ position: 'absolute', left: 10, top: 0 }}
          />
          </TouchableOpacity>

          <Text style={[Style.blackHeaderTitle, { alignSelf: 'center' }]}>
            Vui lòng chọn thiết bị bluetooth
        </Text>

        <TouchableOpacity style={{ width: 40, height: 40 }} onPress={this.scanningDevice}>
          <Icon
            name="refresh-cw"
            type="feather"
            containerStyle={{ position: 'absolute', left: 10, top: 0 }}
          />
        </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.ips}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                width: 400,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                borderColor: Style.color.blackBlue,
                borderWidth: 1,
                marginVertical: 4
              }}
              onPress={() => this.onSetupPrinterUrl(item.address)}
            >
              <Text style={Style.normalDarkText}>{item.name || 'UNKNOWN NAME'} - {item.address}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

export default connect(state => ({
  connect: state.user.printerConnect,
  printerURL: state.user.printerURL,
}), { setPrinterDevice, setLoading, setPrinterConnect })(SetupPrinter);
