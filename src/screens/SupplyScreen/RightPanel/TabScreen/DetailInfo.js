import React from 'react';
import { View, StyleSheet, Text, FlatList, AlertIOS } from 'react-native';
import { connect } from 'react-redux';
import { iOSColors } from 'react-native-typography';
import { Product, ProductBill } from '../../../../models';
import {
  loadStoreProduct,
  setPaybackQuantity,
  loadStoreProductDetail,
  returnProduct,
  loadStore
} from '../../../../actions';
import { formatPrice } from '../../../../utils/String';
import DetailItem from '../../components/DetailItem';
import { ActionButton } from '../../../../components/button';
import { Footer, Title, Style } from '../../../../components';
import EmptyScreen from '../../../../components/EmptyStatus';

type PropsType = {
  products: ProductBill[]
};

const title = ['STT', 'Số lượng', 'Giá nhập', 'Giá bán', 'Đã bán', 'Còn lại', 'Trả hàng'];

class DetailInfo extends React.Component<PropsType> {
  state = {
    paybackQuantity: []
  };

  onChangePaybackQuantity = (text, product: Product) => {
    const { setPaybackQuantity } = this.props;
    if (isNaN(text)) {
      return;
    }
    const quantity = text.length > 0 ? parseInt(text, 10) : 0;
    if (quantity < 0) {
      return;
    }
    if (quantity > product.quantity) {
      AlertIOS.alert(`Sản phẩm này chỉ còn ${product.quantity} cái`);
      return;
    }

    setPaybackQuantity({ quantity, id: product.id });
  };

  onEndReached = () => {
    const { total, skip, loadStoreProductDetail, currentStore } = this.props;
    if (Math.max(skip, 20) >= total) return;
    loadStoreProductDetail({ id: currentStore.id, skip: skip === 0 ? 20 : skip, isContinue: true });
  };

  onCreateBill = data => {
    this.onRefreshData();
    console.log(data);
  };

  onRefreshData = () => {
    const { loadStore, loadStoreProductDetail, currentStore } = this.props;
    if (currentStore && currentStore.id) {
      loadStore(currentStore.id);
      loadStoreProductDetail({ id: currentStore.id, skip: 0 });
    }
  };

  onReturnProduct = isAll => {
    const { products, returnProduct } = this.props;

    const data = isAll
      ? this.getReturnProductData(products, true)
      : this.getReturnProductData(products.filter(item => item.paybackQuantity > 0));
    if (data.totalQuantity === 0) {
      return;
    }
    AlertIOS.alert('Trả hàng', `Xác nhận trả ${data.totalQuantity} sản phẩm? `, [
      {
        text: 'Huỷ',
        style: 'cancel'
      },
      {
        text: 'Xác nhận',
        onPress: () =>
          returnProduct(data, {
            success: () => {
              setTimeout(() => {
                AlertIOS.alert('Trả hàng thành công! In hoá đơn?', null, [
                  {
                    text: 'Không',
                    style: 'cancel',
                    onPress: () => this.onRefreshData()
                  },
                  {
                    text: 'In hoá đơn',
                    onPress: () => this.onCreateBill(data)
                  }
                ]);
              }, 100);
            },
            failure: () =>
              setTimeout(() => {
                AlertIOS.alert('Trả hàng thất bại, vui lòng thử lại!');
              }, 100)
          })
      }
    ]);
  };

  getReturnProductData(products, isAll) {
    const data = {
      note: '',
      totalPrice: 0,
      totalQuantity: 0,
      productList: []
    };

    products.forEach(item => {
      const quantity = isAll ? item.product.quantity : item.paybackQuantity;
      data.productList.push({
        product: item.id,
        quantity
      });
      data.totalQuantity += quantity;
      data.totalPrice += quantity * item.product.importPrice;
    });
    return data;
  }

  getInfos = () => {
    const { products } = this.props;
    let totalQuantity = 0;
    let soldQuantity = 0;
    let totalImportPrice = 0;
    let quantity = 0;
    if (products.length === 0) {
      return {
        totalQuantity,
        totalImportPrice,
        soldQuantity,
        quantity
      };
    }
    products.forEach(item => {
      totalQuantity += item.product.total;
      totalImportPrice += item.product.total * item.product.importPrice;
      soldQuantity += item.product.total - item.product.quantity;
      quantity += item.product.quantity;
    });
    return {
      totalQuantity,
      totalImportPrice,
      soldQuantity,
      quantity
    };
  };

  keyExtractor = item => item.id;

  renderItem = ({ item, index }) => (
    <DetailItem productBill={item} index={index + 1} onChangeText={this.onChangePaybackQuantity} />
  );

  renderFooter() {
    const data = this.getInfos();
    return (
      <Footer
        data={[
          'Sum',
          data.totalQuantity,
          formatPrice(data.totalImportPrice),
          '',
          `${data.soldQuantity} cái`,
          `${data.quantity} cái`,
          ''
        ]}
      />
    );
  }

  renderContent() {
    const { products } = this.props;
    return (
      <FlatList
        data={products}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={1}
        onEndReached={this.onEndReached}
        ListHeaderComponent={this.renderTitle(0)}
      />
    );
  }

  renderTitle() {
    return <Title data={title} />;
  }

  render() {
    const { currentStore } = this.props;
    if (!currentStore || !currentStore.id || currentStore.id.length === 0) {
      return <EmptyScreen label="Vui lòng chọn nguồn hàng" />;
    }

    if (!currentStore.totalFund || currentStore.totalFund === 0) {
      return <EmptyScreen label="Nguồn hàng này chưa có sản phẩm" />;
    }
    return (
      <View style={styles.containerStyle}>
        {this.renderContent()}
        {this.renderFooter()}
        <View style={styles.footerStyle}>
          <ActionButton title="Trả hàng" onPress={() => this.onReturnProduct(false)} />
          <ActionButton title="Trả tất cả" onPress={() => this.onReturnProduct(true)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: { flex: 1 },
  inputStyle: {
    width: 100,
    height: 32,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: iOSColors.tealBlue,
    textAlign: 'center'
  },
  shadowStyle: {
    shadowColor: iOSColors.gray,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.2,
    backgroundColor: Style.color.white
  },
  footerStyle: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
    marginTop: 8
  }
});

export default connect(
  state => ({
    products: state.detail.products,
    pageIndex: state.store.pageIndex,
    currentStore: state.detail.store,
    total: state.detail.totalProduct,
    skip: state.detail.skipProduct
  }),
  { loadStoreProduct, setPaybackQuantity, loadStoreProductDetail, returnProduct, loadStore }
)(DetailInfo);
