import React from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

// import { Print } from 'expo';
import { connect } from 'react-redux';
import { iOSUIKit } from 'react-native-typography';

import {
  removeProductBill,
  setOtherCost,
  submitBill,
  setPrinterDevice,
  setPrinterConnect,
  setDialogStatus,
  importProduct
} from '../../actions';
import { DetailItem } from './components';
import { formatPrice } from '../../utils/String';
import CustomerInfo from './CustomerInfo';
import { Style } from '../../components';

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
    const { productBills, totalQuantity, totalPrice, otherCost, submitBill, user, importProduct, productNeedToSave, defaultStore, navigation } = this.props;
    const { customerName, customerPhone, customerAddress, note, debt } = this.state;
    if (!this.props.connect) {
      navigation.navigate('SetupPrinter');
      return;
    }

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
          product: item.product.id ? item.product.id : { importPrice: item.product.importPrice, exportPrice: item.product.exportPrice },
          quantity: item.soldQuantity,
          discount: item.discount,
          isNew: !item.product.id
        });
      } else {
        data.productList.push({
          product: item.product.id ? item.product.id : { importPrice: item.product.importPrice, exportPrice: item.product.exportPrice },
          quantity: item.paybackQuantity,
          isReturned: true,
          isNew: !item.product.id
        });
      }
    });

    const printBillList = productBills.map(item => ({
      quantity: item.soldQuantity > 0 ? item.soldQuantity : -item.paybackQuantity,
      price: item.product.exportPrice
    }));

    importProduct({
      storeId: defaultStore.id,
      productList: productNeedToSave.map(item => ({ quantity: item.product.quantity, exportPrice: item.product.exportPrice, importPrice: item.product.importPrice }))
    }, { success: () => {
      submitBill(data, {
        success: billInfo => {
          this.showStatusDialog('success');
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
            preCost: totalPrice + totalDiscount - otherCost,
            note: this.state.note
          });
        },
        failure: () => this.showStatusDialog('error')
      });
    },
failure: () => this.showStatusDialog('error') });
  };

  getTitle = () => {
    const { productBills } = this.props;
    const data = [
      ...productBills.filter(item => item.soldQuantity > 0),
      ...productBills.filter(item => item.paybackQuantity > 0)
    ];
    return data;
  };

  showStatusDialog = type => {
    setTimeout(() => {
      this.props.setDialogStatus({
        showDialog: true,
        dialogType: type
      });
    }, 500);
  };

  keyExtractor = item => `${item.id} - ${item.soldQuantity}`;

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
    printerURL: state.user.printerURL,
    user: state.user.info,
    connect: state.user.printerConnect,
    productNeedToSave: state.bill.productNeedToSave,
    defaultStore: state.store.defaultStore
  }),
  {
    removeProductBill,
    setOtherCost,
    submitBill,
    setPrinterDevice,
    setPrinterConnect,
    setDialogStatus,
    importProduct
  }
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
    backgroundColor: Style.color.blackBlue,
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
