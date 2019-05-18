import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Style } from '../../../components';
import { SubmitButton } from '../../../components/button';
import { formatPrice } from '../../../utils/String';

class DetailList extends React.Component {
  renderItem = (label, value) => (
    <View style={{ flex: 1 }}>
      <View style={styles.itemContainerStyle}>
        <Text style={[Style.textEmphasize]}>{label}</Text>
        <Text style={[Style.textEmphasize, { fontWeight: 'bold' }]}>{value}</Text>
      </View>

      <View style={{ width: '100%', height: 1, backgroundColor: Style.color.customDark }} />
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
            onPress={() => {}}
            textStyle={{ fontSize: 16, color: Style.color.lightBlue }}
            buttonStyle={styles.buttonStyle}
          />

          <SubmitButton
            title="Trả tiền thiếu"
            onPress={() => {}}
            textStyle={{ fontSize: 16, color: Style.color.lightBlue }}
            buttonStyle={styles.buttonStyle}
          />
        </View>
      </View>
    );
  }
}

export default connect(state => ({
  billDetail: state.sellHistory.currentBill
}))(DetailList);

const styles = StyleSheet.create({
  itemContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
    // paddingHorizontal: 10
  },
  buttonStyle: {
    width: 140,
    backgroundColor: Style.color.white,
    shadowOffset: { x: 2, y: 0 },
    shadowColor: Style.color.gray,
    shadowOpacity: 0.4
  }
});
