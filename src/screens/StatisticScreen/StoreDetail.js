import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { formatPrice } from '../../utils/String';
import { Style } from '../../components';

class StoreDetail extends React.PureComponent {
  getProductSell() {
    const { data } = this.props;
    try {
      const value =
        parseInt(data.store.totalImportProduct, 10) - parseInt(data.store.productQuantity, 10);
      if (isNaN(value)) return 0;
      return value;
    } catch (er) {
      return 0;
    }
  }

  renderItem(title, value) {
    return (
      <View>
        <Text style={styles.labelStyle}>{title}</Text>
        <Text style={styles.textStyle}>{value}</Text>
      </View>
    );
  }

  render() {
    const { containerStyle, data } = this.props;
    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <View style={styles.verticalIndicatorStyle} />
        <View style={styles.contentStyle}>
          <Text style={styles.titleStyle}>{data.store.name || 'Chọn nguồn hàng'}</Text>
          {this.renderItem('Tổng sản phẩm nhập', `${data.store.totalImportProduct || 0} sản phẩm`)}
          {this.renderItem('Đã bán', `${this.getProductSell()} sản phẩm`)}
          {this.renderItem('Còn lại', `${data.store.productQuantity || 0} sản phẩm`)}
          {this.renderItem('Tổng thu nhập', formatPrice(data.total || 0))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: Style.color.white,
    flex: 1,
    flexDirection: 'row'
  },
  verticalIndicatorStyle: {
    width: 2,
    height: '100%',
    // margin: 12,
    backgroundColor: Style.color.lightBlue
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'space-around',
    marginStart: 20
  },
  labelStyle: Style.normalDarkText,
  titleStyle: Style.blackTitle,
  textStyle: Style.textEmphasize
});

export default StoreDetail;
