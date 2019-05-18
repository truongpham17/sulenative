import React from 'react';
import { iOSUIKit, iOSColors } from 'react-native-typography';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import RowTable from '../../../components/RowTable';
import { formatPrice } from '../../../utils/String';
import { Style } from '../../../components';
import { SubmitButton } from '../../../components/button';

class BillDetail extends React.Component {
  renderItem = (title, info) => (
    <RowTable itemContainerStyle={{ alignItems: 'flex-start' }} containerStyle={{ flex: 1 }}>
      <Text style={Style.normalDarkText}>{title}</Text>
      <Text
        style={[
          Style.textEmphasize,
          {
            textAlign: 'right',
            width: '100%'
          }
        ]}
      >
        {info}
      </Text>
    </RowTable>
  );
  renderPayButton = title => {
    const { billDetail } = this.props;
    return (
      <SubmitButton
        disable={billDetail.paymentStatus === 'paid'}
        title="Trả nợ"
        onPress={() => {}}
        buttonStyle={{ width: '100%', borderRadius: 0 }}
        textStyle={{ fontSize: 16 }}
      />
    );
  };

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
      <View style={styles.containerStyle}>
        <Text style={styles.textStyle}>Thông tin hoá đơn</Text>
        {this.renderItem('Tổng tiền hàng:', formatPrice(total))}
        {this.renderItem('Phụ phí:', formatPrice(billDetail.otherCost))}
        {this.renderItem('Giảm giá:', formatPrice(totalDiscount))}
        {this.renderItem('Tổng:', formatPrice(billDetail.totalPrice))}
        {this.renderItem('Khách trả:', formatPrice(billDetail.totalPaid))}

        <Text style={[Style.normalDarkText, { marginVertical: 12 }]}>
          Ghi chú: {billDetail.note}
        </Text>
        {this.renderPayButton('Trả nợ')}
      </View>
    );
  }
}

export default connect(state => ({
  billDetail: state.sellHistory.currentBill
}))(BillDetail);

const styles = StyleSheet.create({
  containerStyle: {
    flex: 2,
    maxHeight: '58%',
    backgroundColor: Style.color.white,
    padding: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Style.color.lightBorder
  },
  buttonStyle: {
    width: '100%',
    height: 48,
    backgroundColor: iOSColors.blue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    ...Style.blackTitle,
    textAlign: 'center',
    width: '100%'
  }
});
