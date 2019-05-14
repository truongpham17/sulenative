import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AlertIOS
} from 'react-native';
// import { Print } from 'expo';
import { connect } from 'react-redux';
import { iOSUIKit } from 'react-native-typography';
import { removeProductBill, setOtherCost, submitBill, setPrinterDevice } from '../../actions';
import { DetailItem } from './components';
import { formatPrice } from '../../utils/String';
import CustomerInfo from './CustomerInfo';
import { Style } from '../../components';

const title = ['Nguồn', 'Đơn giá', 'SL', 'Tổng'];

class Detail extends React.Component {
  state = {
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    note: '',
    debt: '0'
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

  onSubmitBill = async () => {
    const { productBills, totalQuantity, totalPrice, otherCost } = this.props;
    const { customerName, customerPhone, customerAddress, note, debt } = this.state;

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
      totalPaid: parseInt(totalPrice, 10) - parseInt(debt, 10),
      otherCost
    };
    productBills.forEach(item => {
      if (item.soldQuantity > 0) {
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

    const { printerURL, setPrinterDevice } = this.props;
    // if (!printerURL || printerURL.length === 0) {
    //   const printData = await Print.selectPrinterAsync();
    //   if (printData) {
    //     setPrinterDevice(printData);
    //   }
    // }

    // await Print.printAsync({
    //   printerURL,
    //   html: '<h1>Hello friend!!</h1>'
    // });

    this.sendAPISubmitBill(data);
  };

  getTitle = () => {
    const { productBills } = this.props;
    const data = [
      ...productBills.filter(item => item.soldQuantity > 0),
      ...productBills.filter(item => item.paybackQuantity > 0)
    ];
    return data;
  };

  sendAPISubmitBill = data => {
    const { submitBill } = this.props;
    submitBill(data, {
      success: () => {
        AlertIOS.alert('Thanh toán thành công!!');
        this.setState({
          customerName: '',
          customerAddress: '',
          customerPhone: '',
          debt: '0',
          note: ''
        });
      },
      failure: () => AlertIOS.alert('Thất bại! Vui lòng huỷ bỏ hoá đơn vừa in và thử lại!')
    });
  };

  showDialog = () => {
    const { productBills } = this.props;
    if (productBills.length === 0) {
      return;
    }
    AlertIOS.alert('Xác nhận in hoá đơn?', null, [
      {
        text: 'Huỷ',
        style: 'cancel'
      },
      {
        text: 'In hoá đơn',
        onPress: () => this.onSubmitBill()
      }
    ]);
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
            style={{ ...Style.normalDarkText, flex: 1 }}
          />
        </View>
        <TouchableOpacity
          onPress={this.showDialog}
          style={[styles.submitButtonStyle, { marginTop: 10 }]}
        >
          <Text style={Style.buttonText}>In hoá đơn</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { customerName, customerAddress, customerPhone } = this.state;
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
    printerURL: state.print.printerURL
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
    height: 240,
    padding: 10,
    backgroundColor: Style.color.darkBackground,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  }
});
