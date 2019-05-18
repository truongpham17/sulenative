import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Line, Style } from '../../../components';
import { formatPrice } from '../../../utils/String';

class ListProduct extends React.Component {
  renderItem = ({ item }) => {
    const quantity = item.soldQuantity > 0 ? item.soldQuantity : -item.paybackQuantity;
    return (
      <View style={styles.itemContainer}>
        <Text style={Style.textEmphasize}>{item.product.store.name}</Text>
        <View
          style={{
            backgroundColor: Style.color.background,
            paddingHorizontal: 4,
            paddingVertical: 2,
            borderRadius: 2
          }}
        >
          <Text style={Style.normalDarkText}>{quantity}</Text>
        </View>
        <Text style={[Style.textEmphasize, { fontWeight: 'bold' }]}>
          {formatPrice(item.product.exportPrice)}
        </Text>
      </View>
    );
  };
  render() {
    const { currentBill } = this.props;
    return (
      <FlatList
        ItemSeparatorComponent={() => <Line color={Style.color.customDark} />}
        data={currentBill.productList}
        renderItem={this.renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={(item, index) => `${index} `}
      />
    );
  }
}

export default connect(state => ({
  currentBill: state.sellHistory.currentBill
}))(ListProduct);

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1
  },
  itemContainer: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  }
});
