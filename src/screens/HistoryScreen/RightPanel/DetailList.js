import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { connect } from 'react-redux';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { setPrinterConnect, setPrinterDevice } from '../../../actions';
import { Style } from '../../../components';
import { SubmitButton } from '../../../components/button';
import { formatPrice } from '../../../utils/String';
import { printBill } from '../../../utils/Printer';
import { getDatePrinting } from '../../../utils/Date';
import { AlertInfo } from '../../../utils/Dialog';

class DetailList extends React.Component {
  state = {
    modalVisible: false,
    ids: [],
    connected: false
  };
  onSetupPrinterUrl = async url => {
    const { setPrinterDevice } = this.props;
    setPrinterDevice({ url });
    BluetoothManager.connect(url).then(
      () =>
        this.setState({
          modalVisible: false,
          connected: true
        }),
      () => AlertInfo('Không thể kết nối')
    );
  };

  onSetPrinterConfig = async () => {
    const { printerURL } = this.props;
    // check whether enable bluetooth
    const isBluetoothEnable = await BluetoothManager.isBluetoothEnabled();
    if (!isBluetoothEnable) {
      AlertInfo('Bluetooth chưa được bật', 'Vui lòng bật bluetooth và thử lại');
      return;
    }

    // check if devices already save printer URL, try to connect to this url
    if (printerURL && printerURL.length > 0) {
      // if connect successfully then start printing, else set up again
      BluetoothManager.connect(printerURL).then(() => {
        this.props.setPrinterConnect(true);
      });
    } else {
      this.setState({ modalVisible: true });
      const devicesScan = await BluetoothManager.scanDevices();
      this.setState({
        ips: JSON.parse(devicesScan.found)
      });
    }
  };

  printBill = () => {
    const { billDetail } = this.props;
    if (!this.props.connect) {
      this.onSetPrinterConfig();
      return;
    }

    let totalCostWithoutDiscount = 0;

    billDetail.productList.forEach(item => {
      if (item.soldQuantity > 0) {
        totalCostWithoutDiscount += item.soldQuantity * item.product.exportPrice;
      }
    });

    printBill({
      customerName: billDetail.customer.name,
      customerPhone: billDetail.customer.phone,
      id: billDetail.id,
      thungan: billDetail.createdBy.fullname,
      date: getDatePrinting(billDetail.createAt),
      productList: billDetail.productList.map(item => ({
        quantity: item.soldQuantity > 0 ? item.soldQuantity : -item.paybackQuantity,
        price: item.product.exportPrice
      })),
      totalQuantity: billDetail.totalQuantity,
      totalCost: billDetail.totalPrice,
      discount: totalCostWithoutDiscount - billDetail.totalPrice + billDetail.otherCost,
      otherCost: billDetail.otherCost,
      preCost: totalCostWithoutDiscount
    });
  };

  renderItem = (label, value) => (
    <View style={{ flex: 1 }}>
      <View style={styles.itemContainerStyle}>
        <Text style={[Style.textEmphasize]}>{label}</Text>
        <Text style={[Style.textEmphasize, { fontWeight: 'bold' }]}>{value}</Text>
      </View>

      <View style={{ width: '100%', height: 0.5, backgroundColor: Style.color.customDark }} />
    </View>
  );

  renderScanningPrinter = () => (
    <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
      <Text style={Style.blackHeaderTitle}>Vui lòng chọn thiết bị bluetooth</Text>
      <FlatList
        data={this.state.ips}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              width: 400,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => this.onSetupPrinterUrl(item.address)}
          >
            <Text style={Style.normalDarkText}>{item.name || 'UNKNOWN NAME'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  render() {
    const { billDetail, onPayDebt } = this.props;
    let totalDiscount = 0;
    let total = 0;
    billDetail.productList.forEach(item => {
      totalDiscount += item.discount * item.soldQuantity;
      const value = item.soldQuantity > 0 ? item.soldQuantity : -item.paybackQuantity;
      total += value * item.product.exportPrice;
    });
    const isDebt = billDetail.totalPrice - billDetail.totalPaid > 0;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {this.renderItem('Tổng tiền hàng:', formatPrice(total))}
          {this.renderItem('Giảm giá:', formatPrice(totalDiscount))}
          {this.renderItem('Phụ phí:', formatPrice(billDetail.otherCost))}
          {this.renderItem('Tổng:', formatPrice(billDetail.totalPrice))}
          {this.renderItem('Khách trả:', formatPrice(billDetail.totalPaid))}
          {this.renderItem(
            'Khách thiếu',
            formatPrice(billDetail.totalPrice - billDetail.totalPaid)
          )}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
          <SubmitButton
            title="In hoá đơn"
            onPress={() => this.printBill()}
            textStyle={{ fontSize: 16, color: Style.color.lightBlue }}
            buttonStyle={styles.buttonStyle}
          />

          <SubmitButton
            title="Trả tiền thiếu"
            disable={!isDebt}
            onPress={() => onPayDebt(billDetail.id)}
            textStyle={{ fontSize: 16, color: isDebt ? Style.color.lightBlue : Style.color.white }}
            buttonStyle={styles.buttonStyle}
          />
        </View>
        <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
          {this.renderScanningPrinter()}
        </Modal>
      </View>
    );
  }
}

export default connect(
  state => ({
    billDetail: state.sellHistory.currentBill,
    printerURL: state.user.printerURL,
    user: state.user.info,
    connect: state.user.printerConnect
  }),
  { setPrinterConnect, setPrinterDevice }
)(DetailList);

const styles = StyleSheet.create({
  itemContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonStyle: {
    width: 140,
    backgroundColor: Style.color.white,
    shadowOffset: { x: 2, y: 0 },
    shadowColor: Style.color.gray,
    shadowOpacity: 0.4
  }
});
