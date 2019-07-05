import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { connect } from 'react-redux';
import { setPrinterConnect, setPrinterDevice } from '../../../actions';
import { Style } from '../../../components';
import { SubmitButton } from '../../../components/button';
import { formatPrice } from '../../../utils/String';
import { printBill } from '../../../utils/Printer';
import { getDatePrinting } from '../../../utils/Date';

class DetailList extends React.Component {

  printBill = () => {
    const { billDetail } = this.props;

    let totalCostWithoutDiscount = 0;

    billDetail.productList.forEach(item => {
      if (item.soldQuantity > 0) {
        totalCostWithoutDiscount += item.soldQuantity * item.product.exportPrice;
      }
    });

    printBill({
      customerName: billDetail.customer && billDetail.customer.username,
      customerPhone: billDetail.customer && billDetail.customer.phone,
      id: billDetail.id,
      thungan: billDetail.createdBy.fullname,
      date: getDatePrinting(billDetail.createAt),
      productList: billDetail.productList.map(item => ({
        quantity: item.soldQuantity > 0 ? item.soldQuantity : -item.paybackQuantity,
        price: item.product.exportPrice
      })),
      totalQuantity: billDetail.totalQuantity,
      totalCost: billDetail.totalPrice,
      discount: totalCostWithoutDiscount - billDetail.totalPrice,
      otherCost: 0,
      preCost: totalCostWithoutDiscount
    });
  };

  renderItem = (label, value) => (
    <View style={{ width: '100%', height: 40 }}>
      <View style={styles.itemContainerStyle}>
        <Text style={[Style.textEmphasize]}>{label}</Text>
        <Text style={[Style.textEmphasize, { fontWeight: 'bold' }]}>{value}</Text>
      </View>

      <View style={{ width: '100%', height: 0.5, backgroundColor: Style.color.customDark }} />
    </View>
  );

  render() {
    const { billDetail } = this.props;
    let totalDiscount = 0;
    let total = 0;
    billDetail.productList.forEach(item => {
      totalDiscount += item.discount * item.soldQuantity;
      const value = item.soldQuantity > 0 ? item.soldQuantity : -item.paybackQuantity;
      total += value * item.product.exportPrice;
    });
    const isDebt = billDetail.totalPrice - billDetail.totalPaid > 0;
    return (
      <View>
        <View>
          {billDetail.otherCost > 0 || totalDiscount > 0 ? this.renderItem('Tổng tiền hàng:', formatPrice(total)) : null}
          {totalDiscount > 0 ? this.renderItem('Giảm giá:', formatPrice(totalDiscount)) : null}
          {billDetail.otherCost > 0 ? this.renderItem('Phụ phí:', formatPrice(billDetail.otherCost)) : null}
          {this.renderItem('Tổng:', formatPrice(billDetail.totalPrice))}
          {billDetail.totalPaid < billDetail.totalPrice ? this.renderItem('Khách trả:', formatPrice(billDetail.totalPaid)) : null}
          {billDetail.totalPrice - billDetail.totalPaid > 0 ? this.renderItem(
            'Khách thiếu',
            formatPrice(billDetail.totalPrice - billDetail.totalPaid)
          ) : null}
        </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, height: 48 }}>
          <SubmitButton
            title="In hoá đơn"
            onPress={() => this.printBill()}
            textStyle={{ fontSize: 16, color: Style.color.lightBlue }}
            buttonStyle={styles.buttonStyle}
          />

          <SubmitButton
            title="Trả tiền thiếu"
            disable={!isDebt}
            onPress={() => this.props.navigation.navigate('PayDebt')}
            textStyle={{ fontSize: 16, color: isDebt ? Style.color.lightBlue : Style.color.white }}
            buttonStyle={styles.buttonStyle}
          />
        </View>
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
