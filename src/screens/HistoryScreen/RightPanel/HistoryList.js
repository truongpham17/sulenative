import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { iOSColors } from 'react-native-typography';
import RowTable from '../../../components/RowTable';
import { Title, Style } from '../../../components';
import { ProductBill } from '../../../models';

const title = ['STT', 'Nguồn hàng', 'Đơn giá', 'Số lượng'];

class HistoryList extends React.Component {
  keyExtractor = item => item.product.id;

  renderFooter = () => {
    const { currentBill } = this.props;
    return (
      <RowTable containerStyle={styles.shadowStyle}>
        <Text style={Style.blackTitle}>SUM</Text>
        <View />
        <View />
        <Text style={Style.blackTitle}>{currentBill.totalQuantity}</Text>
        <Text style={Style.blackTitle}>{currentBill.totalPrice}</Text>
      </RowTable>
    );
  };

  renderItem = ({ item, index }) => {
    const quantity = item.soldQuantity > 0 ? item.soldQuantity : -item.paybackQuantity;
    const containerStyle =
      item.paybackQuantity > 0 ? { backgroundColor: iOSColors.customGray } : {};
    return (
      <RowTable containerStyle={containerStyle}>
        <Text style={Style.normalDarkText}>{index + 1}</Text>
        <Text style={Style.normalDarkText}>{item.product.store.name}</Text>
        {/* disount later */}
        <Text style={Style.normalDarkText}>{item.product.exportPrice}</Text>
        <Text style={Style.normalDarkText}>{quantity}</Text>
      </RowTable>
    );
  };

  render() {
    const { currentBill } = this.props;
    return (
      <View style={styles.containerStyle}>
        <Title data={title} />
        <FlatList
          data={currentBill.productList}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 3,
    marginEnd: 10,
    backgroundColor: Style.color.white
  },
  itemContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainerStyle: {
    width: '100%',
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Style.color.customDark
  },
  shadowStyle: {
    shadowColor: iOSColors.gray,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.2,
    backgroundColor: Style.color.white
  }
});

export default connect(state => ({
  currentBill: state.sellHistory.currentBill
}))(HistoryList);
