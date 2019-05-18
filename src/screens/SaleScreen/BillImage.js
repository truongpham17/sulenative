import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ViewShot from 'react-native-view-shot';
import {
  BluetoothEscposPrinter
  //   Device
} from 'react-native-bluetooth-escpos-printer';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';

class BillImage extends Component {
  state = { img: '', fonttype: 0, widthtimes: 0, heigthtimes: 0 };

  onPrint = async data => {
    await BluetoothEscposPrinter.printerInit();
    await BluetoothEscposPrinter.printerLeftSpace(0);
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.setBlob(0);

    await BluetoothEscposPrinter.printText('DUNG LIEN\r\n', {
      encoding: 'GBK',
      codepage: 0,
      widthtimes: 2,
      heigthtimes: 2,
      fonttype: 0
    });
    await BluetoothEscposPrinter.printText('DC: 44 Le Minh Xuan - P.8 - Q.TB - TP.HCM\r\n', {});
    await BluetoothEscposPrinter.printText('DT: 0905.182225 - 0909.841215\r\n', {});
    await BluetoothEscposPrinter.printText('CHK: N.T.TRAM ANH - NH.Agribank: 636020534\r\n', {});
    await BluetoothEscposPrinter.printText(
      'CHK: N.T.TRAM ANH - NH.Sacombank: 60618762\r\n\r\n',
      {}
    );

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
    // await BluetoothEscposPrinter.printerLeftSpace(10);
    await BluetoothEscposPrinter.printText(`ID: ${data.id}\r\n`, {});
    await BluetoothEscposPrinter.printText(`Thoi gian: ${data.date}\r\n`, {});
    await BluetoothEscposPrinter.printText(`Khach hang: ${data.customer}\r\n`, {});
    await BluetoothEscposPrinter.printText(`Thu ngan: ${data.thungan}\r\n\r\n`, {});
    const columnWidths = [6, 16, 10, 16];

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

    await BluetoothEscposPrinter.printColumn(
      columnWidths,
      [
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT
      ],
      ['STT', 'Gia', 'So luong', 'Thanh tien'],
      {}
    );
    await BluetoothEscposPrinter.printText('\r\n', {});

    data.productList.forEach(async (item, index) => {
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT
        ],
        [index, `${item.price}.000 VND`, `${item.quantity} cai`, `${item.total}.000 VND`],
        {}
      );
    });

    await BluetoothEscposPrinter.printText('\r\n', {});
    await BluetoothEscposPrinter.printColumn(
      [16, 6, 10, 16],
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT
      ],
      ['Tong cong', '', `${data.totalQuantity} cai`, `${data.totalCost}.000 VND`],
      {}
    );
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

    await BluetoothEscposPrinter.printText('-----------------------------------------\r\n', {});
    await BluetoothEscposPrinter.printText('LUU Y: Khi doi tra hang nho mang theo hoa don\r\n', {});
    await BluetoothEscposPrinter.printText('HEN GAP LAI QUY KHACH!\r\n', {});
    await BluetoothEscposPrinter.printText('-----------------------------------------\r\n', {});
    await BluetoothEscposPrinter.printText('\r\n\r\n\r\n\r\n', {});
  };

  render() {
    return (
      <ViewShot ref="viewShot" options={{ result: 'base64' }}>
        <View>
          <Text>DŨNG LIÊN</Text>
          <Text>Địa chỉ: Quận 12, TP Hồ Chí Minh</Text>
          <Text>Địa chỉ: Quận 12, TP Hồ Chí Minh</Text>
        </View>
        <TextInput
          style={{ width: 100, height: 100 }}
          value={this.state.text}
          placeholder="TExt"
          onChangeText={text => this.setState({ text })}
        />
        <TextInput
          style={{ width: 100, height: 100 }}
          value={this.state.fonttype}
          placeholder="Font type"
          onChangeText={text => this.setState({ fonttype: text })}
        />
        <TextInput
          style={{ width: 100, height: 100 }}
          value={this.state.widthtimes}
          placeholder="width"
          onChangeText={text => this.setState({ widthtimes: text })}
        />
        <TextInput
          style={{ width: 100, height: 100 }}
          value={this.state.heigthtimes}
          placeholder="height"
          onChangeText={text => this.setState({ heigthtimes: text })}
        />
        <TouchableOpacity onPress={this.onPrint}>
          <Text>Print</Text>
        </TouchableOpacity>
      </ViewShot>
    );
  }
}

export default BillImage;
