import React from 'react';
import { iOSColors } from 'react-native-typography';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import RowTable from '../../../components/RowTable';
import { Style } from '../../../components';
import { SubmitButton } from '../../../components/button';

type PropsType = {
  name: string,
  phone: string,
  address?: string
};

class CustomerDetail extends React.Component<PropsType> {
  renderItem = (title, info, arr) => (
    <RowTable
      itemContainerStyle={{ alignItems: 'flex-start' }}
      containerStyle={{ flex: 1 }}
      flexArray={arr}
    >
      <Text style={Style.normalDarkText}>{title}</Text>
      <Text style={[Style.textEmphasize, { textAlign: 'right', width: '100%' }]}>{info}</Text>
    </RowTable>
  );
  render() {
    const { info } = this.props;
    const data = info || {};
    return (
      <View style={styles.containerStyle}>
        <Text style={styles.textStyle}>Khách hàng</Text>
        {this.renderItem('Tên: ', data.name, [1, 2])}
        {this.renderItem('Địa chỉ: ', data.address || '', [1, 2])}
        {this.renderItem('Số điện thoại: ', data.phone || '', [2, 3])}

        {/* <TouchableOpacity style={styles.buttonStyle}>
          <Text style={Style.buttonText}>In hoá đơn</Text>
        </TouchableOpacity> */}
      </View>
    );
  }
}

export default connect(state => ({
  info: state.sellHistory.currentBill.customer
}))(CustomerDetail);

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    maxHeight: '30%',
    backgroundColor: Style.color.white,
    padding: 8,
    borderWidth: 1,
    borderColor: Style.color.lightBorder
  },
  buttonStyle: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: iOSColors.blue
  },
  textStyle: {
    ...Style.blackTitle,
    textAlign: 'center',
    width: '100%'
  }
});
