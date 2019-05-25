import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AlertIOS,
  Modal
} from 'react-native';
// import { Print } from 'expo';
import { connect } from 'react-redux';
import { iOSUIKit } from 'react-native-typography';

import { removeProductBill, setOtherCost, submitBill, setPrinterDevice } from '../../actions';
import { DetailItem } from './components';
import { formatPrice } from '../../utils/String';
import CustomerInfo from './CustomerInfo';
import { Style } from '../../components';

import {
  BluetoothManager
  //   Device
} from 'react-native-bluetooth-escpos-printer';
import { AlertInfo, Alert } from '../../utils/Dialog';
import BillImage from './BillImage';
import { printBill } from '../../utils/Printer';
import { getDatePrinting } from '../../utils/Date';

const title = ['Nguồn', 'Đơn giá', 'SL', 'Tổng'];

class Detail extends React.Component {
  state = {
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    note: '',
    debt: '0',
    modalVisible: false,
    ids: [],
    connected: false
  };

  onRemove = id => {
    const { removeProductBill } = this.props;
    removeProductBill(id);
  };

  onChangeText = (text, type) => {
    this.setState({ [type]: text });
  };

  onChangeNumber = (text, type) => {
    if (!text || text === '') {
      this.setState({ [type]: '' });
      return;
    }
    if (!isNaN(text)) {
      this.setState({
        [type]: `${parseInt(text, 10)}`
      });
    }
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
      BluetoothManager.connect(printerURL).then(
        () => {
          // this.printBill();
          this.setState({ connected: true });
        },
        () => {
          this.onPrint();
        }
      );
    }
    // else, try to scan bluetooth
    else {
      // await BluetoothManager.connect('EF7AAB58-92AA-BF87-FC00-E119A7EA6A6E');
      // console.log('connect successfully!!');
      // this.setState({
      //   connected: true
      // });
      this.setState({ modalVisible: true });
      const devicesScan = await BluetoothManager.scanDevices();
      this.setState({
        ips: JSON.parse(devicesScan.found)
      });
    }
  };

  onSubmitBill = async () => {
    const { productBills, totalQuantity, totalPrice, otherCost, submitBill, user } = this.props;
    const { customerName, customerPhone, customerAddress, note, debt } = this.state;
    // if (!connected) {
    //   this.onSetPrinterConfig();
    //   return;
    // }
    const data = {
      productList: [],
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress
      },
      note,
      totalQuantity,
      totalPrice,
      totalPaid: parseInt(totalPrice, 10) - parseInt(debt, 10) + parseInt(otherCost, 10),
      otherCost,
      createdBy: user._id
    };

    let totalDiscount = 0;
    productBills.forEach(item => {
      if (item.soldQuantity > 0) {
        totalDiscount += item.soldQuantity * item.discount;
        data.productList.push({
          product: item.product.id,
          quantity: item.soldQuantity,
          discount: item.discount
        });
      } else {
        data.productList.push({
          product: item.product.id,
          quantity: item.paybackQuantity,
          isReturned: true
        });
      }
    });

    const printBillList = productBills.map(item => ({
      quantity: item.soldQuantity > 0 ? item.soldQuantity : -item.paybackQuantity,
      price: item.product.exportPrice
    }));

    submitBill(data, {
      success: billInfo => {
        AlertIOS.alert('Thanh toán thành công!!');
        this.setState({
          customerName: '',
          customerAddress: '',
          customerPhone: '',
          debt: '0',
          note: ''
        });
        printBill({
          customerName: data.customer.name,
          customerPhone: data.customer.phone,
          id: billInfo._id,
          thungan: user.fullname,
          date: getDatePrinting(),
          productList: printBillList,
          totalQuantity,
          totalCost: totalPrice,
          discount: totalDiscount,
          otherCost,
          // eslint-disable-next-line no-mixed-operators
          preCost: totalPrice + totalDiscount - otherCost
        });
      },
      failure: () => AlertIOS.alert('Thất bại!', 'Vui lòng thử lại')
    });
  };

  getTitle = () => {
    const { productBills } = this.props;
    const data = [
      ...productBills.filter(item => item.soldQuantity > 0),
      ...productBills.filter(item => item.paybackQuantity > 0)
    ];
    return data;
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <DetailItem
      data={item}
      containerStyle={styles.itemStyle}
      textStyle={iOSUIKit.body}
      onRemove={this.onRemove}
    />
  );

  renderTitle(data) {
    return data.map((value, index) => (
      <Text style={[Style.blackTitle, { textAlign: 'left' }]} key={index}>
        {value}
      </Text>
    ));
  }

  renderFooter() {
    const { note, debt } = this.state;
    const { otherCost, totalDiscount, totalPrice, totalQuantity, setOtherCost } = this.props;
    return (
      <View style={styles.footerContainerStyle}>
        <View style={styles.footerStyle}>
          <Text style={[styles.textSumStyle, { textAlign: 'left' }]}>Phụ phí:</Text>
          <TextInput
            style={styles.textInputStyle}
            placeholderTextColor={Style.color.placeholder}
            value={otherCost}
            onChangeText={text => setOtherCost(text)}
            keyboardType="number-pad"
            placeholder="0"
            textAlign="right"
          />
        </View>
        <View style={styles.footerStyle}>
          <Text style={[styles.textSumStyle, { textAlign: 'left' }]}>Ghi nợ:</Text>
          <TextInput
            style={styles.textInputStyle}
            placeholderTextColor={Style.color.placeholder}
            value={debt}
            onChangeText={text => this.onChangeNumber(text, 'debt')}
            keyboardType="number-pad"
            placeholder="0"
            textAlign="right"
          />
        </View>
        <View style={styles.footerStyle}>
          <Text style={[styles.textSumStyle, { textAlign: 'left' }]}>Giảm giá:</Text>
          <Text style={[styles.textEmpStyle, { textAlign: 'right' }]}>
            {formatPrice(totalDiscount)}
          </Text>
        </View>
        <View style={styles.footerStyle}>
          <Text style={[styles.textSumStyle, { textAlign: 'left' }]}>Tổng cộng:</Text>
          <Text style={styles.textEmpStyle}>{totalQuantity} cái</Text>
          <Text style={[styles.textEmpStyle, { textAlign: 'right' }]}>
            {formatPrice(totalPrice)}
          </Text>
        </View>
        <View style={styles.footerStyle}>
          <TextInput
            value={note}
            onChangeText={text => this.onChangeText(text, 'note')}
            placeholder="Ghi chú..."
            style={styles.noteInputStyle}
          />
        </View>
        <TouchableOpacity
          onPress={this.onSubmitBill}
          style={[styles.submitButtonStyle, { marginTop: 10 }]}
        >
          <Text style={Style.buttonText}>In hoá đơn</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

  renderReBill = () => <BillImage callback={() => this.setState({ modalVisible: false })} />;

  render() {
    const { customerName, customerAddress, customerPhone, connected } = this.state;
    const { productBills } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainerStyle}>{this.renderTitle(title)}</View>
        <FlatList
          contentContainerStyle={{ paddingVertical: 5, paddingHorizontal: 10 }}
          data={productBills}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
        <CustomerInfo
          onChangeText={this.onChangeText}
          name={customerName}
          address={customerAddress}
          phone={customerPhone}
        />
        <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
          {this.renderScanningPrinter()}
        </Modal>
        {this.renderFooter()}
      </View>
    );
  }
}
export default connect(
  state => ({
    productBills: state.bill.productBills,
    totalPrice: state.bill.totalPrice,
    totalQuantity: state.bill.totalQuantity,
    totalDiscount: state.bill.totalDiscount,
    otherCost: state.bill.otherCost,
    printerURL: state.print.printerURL,
    user: state.user.info
  }),
  { removeProductBill, setOtherCost, submitBill, setPrinterDevice }
)(Detail);

const styles = StyleSheet.create({
  itemStyle: {
    height: 80,
    marginTop: 4,
    borderRadius: 8
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center'
  },
  titleContainerStyle: {
    width: '100%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Style.color.darkBackground,
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 10
  },
  footerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textSumStyle: {
    flex: 1,
    ...Style.normalDarkText,
    textAlign: 'center'
  },
  textEmpStyle: {
    flex: 1,
    ...Style.textEmphasize,
    textAlign: 'center'
  },
  taxStyle: {
    width: 180,
    height: 28,
    flexDirection: 'row'
  },
  textInputStyle: {
    paddingStart: 4,
    ...Style.textEmphasize,
    width: 80,
    // height: 36,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    paddingEnd: 4,
    paddingVertical: 2,
    marginEnd: -4
  },
  submitButtonStyle: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    backgroundColor: Style.color.lightBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerContainerStyle: {
    width: '100%',
    height: 260,
    padding: 10,
    backgroundColor: Style.color.darkBackground,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  noteInputStyle: {
    ...Style.normalDarkText,
    width: '100%',
    height: 44,
    color: Style.color.black,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    marginTop: 8,
    paddingStart: 8,
    marginBottom: 8
  }
});
