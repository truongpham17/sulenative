import React from 'react';
import { View, DeviceEventEmitter, TouchableOpacity, Text, FlatList } from 'react-native';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter
  //   Device
} from 'react-native-bluetooth-escpos-printer';

const BLUETOOTH_NOT_ENABLE = 'bluetooth-not-enable';
const BLUETOOTH_ENABLE = 'bluetooth-enable';

const DEVICE_PAIR = 'device-pair';

class Printer extends React.Component {
  state = {
    status: '',
    paired: [],
    found: [
      {
        address: 'EF7AAB58-92AA-BF87-FC00-E119A7EA6A6E',
        name: 'BlueTooth Printer'
      }
    ],
    boundAddress: '',
    loading: true
  };

  async componentDidMount() {
    const isBluetoothEnable = await BluetoothManager.isBluetoothEnabled();
    if (!isBluetoothEnable) {
      return;
    }

    // // not scan
    // const devicesScan = await BluetoothManager.scanDevices();
    // if (devicesScan) {
    //   // found pair
    //   console.log(devicesScan.paired);
    //   const paired = JSON.parse(devicesScan.paired);
    //   if (paired && paired.length > 0) {
    //     this.connectToPrinter(paired[0]);
    //     console.log('paired!!');
    //     return;
    //   }
    //   console.log('loading devices...');
    //   // not found pair, show list
    //   this.setState({
    //     found: JSON.parse(devicesScan.found)
    //   });
    // }
  }

  connectToPrinter = async rsp => {
    console.log('connect to printer');
    await BluetoothManager.connect(rsp.address);
    this.setState({
      boundAddress: rsp.address,
      loading: false
    });
  };
  print = async () => {
    if (this.state.boundAddress.length > 0) {
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printerLeftSpace(0);
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText('DUNG LIEN\r\n', {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 3,
        fonttype: 1
      });
    }
  };

  render() {
    console.log(this.state.found);
    return (
      <View>
        <TouchableOpacity
          onPress={this.print}
          style={this.state.loading ? { backgroundColor: 'red' } : { backgroundColor: 'blue' }}
        >
          <Text>Press here to print</Text>
        </TouchableOpacity>
        <FlatList
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.connectToPrinter(item)}>
              <Text>
                {item.address} - {item.name}
              </Text>
            </TouchableOpacity>
          )}
          data={this.state.found}
        />
      </View>
    );
  }
}

export default Printer;
