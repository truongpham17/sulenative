import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { iOSColors, iOSUIKit } from 'react-native-typography';
import { connect } from 'react-redux';
import { formatPrice } from '../../../utils/String';
import { Store } from '../../../models/Store';
import { Style } from '../../../components';

type PropsType = {
  data: Store,
  currentStore: Store
};

class Detail extends React.Component<PropsType> {
  render() {
    const { storeInfo } = this.props;
    const { store } = storeInfo;
    return (
      <View style={styles.containerStyle}>
        <Text style={Style.smallTextEmphasize}>Tên nguồn hàng: {store.name}</Text>
        <View style={styles.rowContainer}>
          <Text style={Style.smallTextEmphasize}>
            Tổng số lượng nhập: {store.totalImportProduct} cái
          </Text>
          <Text style={Style.smallTextEmphasize}>Đã bán: {store.totalSoldProduct} cái</Text>
        </View>

        <View style={styles.rowContainer}>
          <Text style={Style.smallTextEmphasize}>Tổng vốn: {formatPrice(store.totalFund)}</Text>
          <Text style={Style.smallTextEmphasize}>
            Tiền bán: {formatPrice(store.totalSoldMoney)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: iOSColors.customGray,
    justifyContent: 'space-around',
    paddingHorizontal: 20
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default connect(state => ({
  storeInfo: state.detail
}))(Detail);
