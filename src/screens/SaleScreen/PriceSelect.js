import React from 'react';
import { View, StyleSheet, Text, AlertIOS, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { PriceItem } from './components';
import { EmptyStatus, Style } from '../../components';
import { Store, ProductBill } from '../../models';
import {
  setCurrentProductBills,
  setQuantity,
  setProductBill,
  setProductReturn,
  setDiscount,
  loadStoreProduct
} from '../../actions';

type PropsType = {
  currentStore: Store,
  currentProductBills: ProductBill,
  setQuantity: () => null,
  isSell: boolean,
  productBills: ProductBill[]
};

class PriceSelect extends React.Component<PropsType> {
  state = {
    refreshing: false
  };
  onQuantityChange = (productBill, value, isSubmit) => {
    const { setQuantity, isSell } = this.props;
    if (isNaN(value)) {
      AlertIOS.alert('Vui lòng nhập số!!');
      return;
    }

    const quantity = parseInt(value, 10);

    if (isSell && productBill.product.quantity < quantity) {
      AlertIOS.alert(`Sản phẩm chỉ còn ${productBill.product.quantity} cái!`);
      return;
    }

    setQuantity({ id: productBill.id, value: quantity });

    if (isSubmit) {
      const product = isSell
        ? { ...productBill, soldQuantity: value }
        : { ...productBill, paybackQuantity: value };
      this.onSubmit(product);
    }
  };

  onSubmit = (data: ProductBill) => {
    const { setProductBill, currentStore, isSell, setProductReturn } = this.props;
    const product = { ...data, product: { ...data.product, store: currentStore } };
    if (isSell) {
      setProductBill(product);
    } else {
      setProductReturn(product);
    }
  };

  onRefresh = () => {
    const { loadStoreProduct, currentStore } = this.props;
    loadStoreProduct(
      {
        id: currentStore.id,
        skip: 0
      },
      {
        success: () => this.setState({ refreshing: false }),
        failure: () => this.setState({ refreshing: false })
      }
    );
  };

  onEndReached = () => {
    const { total, skip, currentStore, loadStoreProduct, loading } = this.props;
    if (Math.max(skip, 20) >= total || loading) return;
    loadStoreProduct({
      id: currentStore.id,
      skip: skip === 0 ? 20 : skip,
      isContinue: true
    });
  };

  setDiscount = (id, value) => {
    const { setDiscount } = this.props;
    setDiscount({ id, value });
  };

  isSubmit = id => {
    const { productBills } = this.props;
    return productBills.filter(item => item.id === id).length > 0;
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <PriceItem
      product={item}
      onQuantityChange={(id, value, isSubmit) => this.onQuantityChange(id, value, isSubmit)}
      onSubmit={data => this.onSubmit(data)}
      isSubmit={this.isSubmit(item.id)}
      isSell={this.props.isSell}
      setDiscount={this.setDiscount}
    />
  );

  renderContent() {
    const { currentProductBills, currentStore } = this.props;
    if (!currentStore.id || currentStore.id === '') {
      return (
        <EmptyStatus
          label="Vui lòng chọn nguồn hàng"
          textStyle={{ fontSize: 16, marginStart: 10 }}
          containerStyle={styles.emptyContainerStyle}
          icon={{ name: 'shopping-cart', size: 20, type: 'feather' }}
        />
      );
    }
    return (
      <FlatList
        data={currentProductBills}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        extraData={this.props}
        onEndReachedThreshold={0.5}
        onEndReached={this.onEndReached}
        style={styles.contentStyle}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="interactive"
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainerStyle}>
          <Text style={Style.blackEmphasizeTitle}>Chọn số lượng</Text>
        </View>
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainerStyle: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    width: '100%',
    backgroundColor: Style.color.darkBackground
  },
  contentStyle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 1
  },
  emptyContainerStyle: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingTop: 10
  }
});

export default connect(
  state => ({
    currentStore: state.store.currentStore,
    currentProductBills: state.bill.currentProductBills,
    isSell: state.bill.isSell,
    productBills: state.bill.productBills,
    total: state.bill.total,
    skip: state.bill.skip,
    loading: state.bill.loadingBill,
    firstLoading: state.bill.firstLoading
  }),
  {
    setCurrentProductBills,
    setQuantity,
    setProductBill,
    setProductReturn,
    setDiscount,
    loadStoreProduct
  }
)(PriceSelect);
