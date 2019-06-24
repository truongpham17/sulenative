import React from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

// import { Print } from 'expo';
import { connect } from 'react-redux';
import { iOSUIKit } from 'react-native-typography';

import {
  removeProductBill,
  submitBill,
  setPrinterDevice,
  setPrinterConnect,
  setDialogStatus,
  importProduct
} from '../../actions';
import { formatPrice } from '../../utils/String';
import { Style, DetailItem } from '../../components';

import { printBill } from '../../utils/Printer';
import { AlertInfo } from '../../utils/Dialog';
import { getDatePrinting } from '../../utils/Date';

const title = ['Nguồn', '', 'Số lượng', 'Đơn giá', 'Tổng'];


class Detail extends React.Component {
  state = {
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    note: '',
    debt: '0',
  };

  onRemove = index => {
    const { removeProductBill } = this.props;
    removeProductBill(index);
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
    const { bills, totalQuantity, totalPrice, user, totalDiscount, submitBill, customer } = this.props;
    const { note, debt } = this.state;

    // for testing only, product will use this function
    // if (!this.props.connect) {
    //   navigation.navigate('SetupPrinter');
    //   return;
    // }

    const realDebt = Number.isInteger(parseInt(debt, 10)) ? parseInt(debt, 10) : 0;
    console.log(realDebt);
    console.log(debt);
    if (realDebt > 0 && (!customer.username || customer.username.length === 0)) {
      AlertInfo('Vui lòng nhập khách hàng để ghi nợ');
      return;
    }

    if (bills.length === 0) {
      AlertInfo('Vui lòng chọn sản phẩm');
      return;
    }


    const productList = bills.map(item => ({
      quantity: item.quantity,
      exportPrice: item.exportPrice,
      importPrice: item.importPrice,
      store: item.store,
      discount: item.discount || 0,
      isReturned: !item.isSell
    }));

    const data = {
      productList,
      customer,
      debt: Number.isInteger(parseInt(debt, 10)) ? parseInt(debt, 10) : 0
    };

    submitBill(data, {
      success: (billInfo) => {
        this.showStatusDialog('success');
        printBill({
          customerName: data.customer && data.customer.username,
          customerPhone: data.customer && data.customer.phone,
          id: billInfo._id,
          thungan: user.fullname,
          date: getDatePrinting(),
          productList: bills.map(item => ({
            quantity: item.quantity * (item.isSell ? 1 : -1),
            price: item.exportPrice
          })),
          totalQuantity,
          totalCost: totalPrice,
          discount: totalDiscount,
          otherCost: 0,
          // eslint-disable-next-line no-mixed-operators
          preCost: totalPrice + totalDiscount,
          note
        });
      },
      failure: () => this.showStatusDialog('error')
    });
  };

  getTitle = () => {
    const { bills } = this.props;
    const data = [
      ...bills.filter(item => item.soldQuantity > 0),
      ...bills.filter(item => item.paybackQuantity > 0)
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

  keyExtractor = (item, index) => `${index}-${item.exportPrice}-${item.quantity}`;

  renderItem = ({ item, index }) => (
    <DetailItem
      data={item}
      containerStyle={styles.itemStyle}
      textStyle={iOSUIKit.body}
      onRemove={this.onRemove}
      index={index}
    />
  );

  renderTitle(data) {
    return data.map((value, index) => (
      <Text style={[Style.blackTitle, { textAlign: 'center', flex: 1 }]} key={index}>
        {value}
      </Text>
    ));
  }

  renderFooter() {
    const { note, debt } = this.state;
    const { totalDiscount, totalPrice, totalQuantity } = this.props;
    return (
      <View style={styles.footerContainerStyle}>

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
    const { bills, customer } = this.props;
    console.log(customer);
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainerStyle}>{this.renderTitle(title)}</View>

        <FlatList
          contentContainerStyle={{ paddingVertical: 5, paddingHorizontal: 10 }}
          data={bills}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />

        <TouchableOpacity
          onPress={() => this.props.onShowUser()}
          style={[styles.selectUserContainer, { paddingVertical: 15 }]}
          behavior="padding"
        >
          <Text style={[Style.buttonText, { fontSize: 16 }]}>{customer.username ? `Khách hàng: ${customer.username}` : '+ Nhập khách hàng'}</Text>
        </TouchableOpacity>

      {this.renderFooter()}


      </View>
    );
  }
}
export default connect(
  state => ({
    bills: state.bill.bills,
    totalPrice: state.bill.totalPrice,
    totalQuantity: state.bill.totalQuantity,
    totalDiscount: state.bill.totalDiscount,
    printerURL: state.user.printerURL,
    user: state.user.info,
    connect: state.user.printerConnect,
    productNeedToSave: state.bill.productNeedToSave,
    defaultStore: state.store.defaultStore,
    customer: state.bill.customer
  }),
  {
    removeProductBill,
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
  },
  selectUserContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.color.blackBlue
  }
});
