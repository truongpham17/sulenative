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
import { formatPrice } from '../../utils/String';
import { Style, DetailItem } from '../../components';

import { printBill } from '../../utils/Printer';
import { getDatePrinting } from '../../utils/Date';

const title = ['Nguồn', '', 'Số lượng', 'Đơn giá', 'Tổng'];


class Detail extends React.Component {


  onRemove = index => {
    const { removeProductBill } = this.props;
    removeProductBill(index);
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
      <Text style={[Style.blackTitle, { textAlign: 'left' }]} key={index}>
        {value}
      </Text>
    ));
  }

  renderDetail() {
    const { currentStore } = this.props;
    const { quantity, exportPrice, importPrice } = this.state;
    return (
      <View style={styles.detailContainer}>
        <Text style={styles.textStyle}>Thông tin</Text>
        {this.renderDetailItem('Tên nguồn hàng: ', currentStore.name)}
        {this.renderDetailItem('Tổng số lượng nhập: ', `${quantity || 0} cái`)}
        {this.renderDetailItem('Tổng tiền nhập: ', formatPrice(importPrice))}
        {this.renderDetailItem('Tông tiền có thể bán: ', formatPrice(exportPrice))}
        {this.renderDetailItem('Tiền nợ nguồn hàng: ', formatPrice(currentStore.debt))}

        <RowTable flexArray={[0, 1]} itemContainerStyle={{ alignItems: 'flex-end' }}>
          <Text style={Style.normalDarkText}>Ghi thêm nợ</Text>
          <TextInput
            style={styles.textInputStyle}
            keyboardType="number-pad"
            onChangeText={this.onChangeDebt}
            value={this.state.debt}
            textAlign="right"
          />
        </RowTable>
        <TextInput
          placeholder="Ghi chú"
          style={styles.noteInputStyle}
          onChangeText={text => this.setState({ note: text })}
          value={this.state.note}
        />
        <SubmitButton
          title="Xác nhận"
          onPress={this.onSubmitImport}
          buttonStyle={{ width: '100%', marginTop: 10 }}
          textStyle={{ fontSize: 16 }}
        />
      </View>
    );
  }


  render() {
    const { bills } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainerStyle}>{this.renderTitle(title)}</View>
        <FlatList
          contentContainerStyle={{ paddingVertical: 5, paddingHorizontal: 10 }}
          data={bills}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />


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
