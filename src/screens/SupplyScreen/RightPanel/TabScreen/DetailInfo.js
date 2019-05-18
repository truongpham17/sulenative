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
  loadStore,
  updateStore,
  loadStoreInfo,
  setCurrentStore
} from '../../../../actions';
import { formatPrice } from '../../../../utils/String';
import DetailItem from '../../components/DetailItem';
import { SubmitButton } from '../../../../components/button';
import { Title, Style, RowTable } from '../../../../components';
import EmptyScreen from '../../../../components/EmptyStatus';
import LOAD_NUMBER from '../../../../utils/System';
import { Promt, AlertInfo } from '../../../../utils/Dialog';

type PropsType = {
  products: ProductBill[]
};

const title = ['Số lượng', 'Giá nhập', 'Giá bán', 'Đã bán', 'Còn lại'];

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

  onChangeExportPrice = (exportPrice, product) => {};

  onEndReached = () => {
    const { total, skip, loadStoreProductDetail, currentStore } = this.props;
    if (Math.max(skip, LOAD_NUMBER) >= total) return;
    loadStoreProductDetail({
      id: currentStore.id,
      skip: skip === 0 ? LOAD_NUMBER : skip,
      isContinue: true
    });
  };

  onCreateBill = data => {
    this.onRefreshData();
  };

  onRefreshData = () => {
    const { loadStore, loadStoreProductDetail, currentStore } = this.props;
    if (currentStore && currentStore.id) {
      loadStore(currentStore.id);
      loadStoreProductDetail({ id: currentStore.id, skip: 0 });
    }
  };

  onPayDebt = () => {
    const { currentStore } = this.props;
    Promt(
      'Nhập số tiền trả',
      null,
      'Huỷ',
      'Trả nợ',
      this.updateStore,
      null,
      currentStore.debt,
      'numeric'
    );
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
    let totalSoldMoney = 0;
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
      totalSoldMoney += (item.product.total - item.product.quantity) * item.product.exportPrice;
    });
    return {
      totalQuantity,
      totalImportPrice,
      soldQuantity,
      quantity,
      totalSoldMoney
    };
  };

  updateStore = text => {
    const { currentStore, updateStore } = this.props;
    if (isNaN(text) || text.length === 0) {
      AlertInfo(
        'Lỗi',
        `Vui lòng nhập số lớn hơn 0 và bé hơn ${currentStore.debt}`,
        this.updateStore
      );
      return;
    }
    const value = parseInt(text, 10);
    if (value <= 0 || value > currentStore.debt) {
      AlertInfo(
        'Lỗi',
        `Vui lòng nhập số lớn hơn 0 và bé hơn ${currentStore.debt}`,
        this.updateStore
      );
      return;
    }
    updateStore(
      { id: currentStore.id, name: currentStore.name, debt: currentStore.debt - value },
      {
        success: () => AlertInfo('Thành công!'),
        failure: () => AlertInfo('Lỗi!', 'Vui lòng thử lại!')
      }
    );
  };

  keyExtractor = item => item.id;

  renderItem = ({ item, index }) => (
    <DetailItem
      productBill={item}
      index={index + 1}
      onChangeText={this.onChangePaybackQuantity}
      onChangeExportPrice={this.onChangeExportPrice}
    />
  );

  renderDetailItem = (title, info) => (
    <RowTable itemContainerStyle={{ alignItems: 'flex-start' }} flexArray={[2, 1]}>
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

  renderDetail() {
    const { currentStore } = this.props;
    const data = this.getInfos();
    return (
      <View style={styles.detailContainerStyle}>
        <Text style={styles.textStyle}>Thông tin</Text>
        {this.renderDetailItem('Tên nguồn hàng: ', currentStore.name)}
        {this.renderDetailItem('Đã nhập: ', formatPrice(data.totalQuantity))}
        {this.renderDetailItem('Đã bán: ', formatPrice(data.soldQuantity))}
        {this.renderDetailItem('Còn lại: ', `${data.quantity} cái`)}
        {this.renderDetailItem('Tổng tiền nhập: ', formatPrice(data.totalImportPrice))}
        {this.renderDetailItem('Tổng tiền bán được: ', formatPrice(data.totalSoldMoney))}
        {this.renderDetailItem('Tiền nợ nguồn hàng: ', formatPrice(currentStore.debt))}
        <View style={{ width: '100%', marginTop: 10, flexDirection: 'row' }}>
          <SubmitButton
            title="Trả hàng"
            onPress={() => this.onReturnProduct(false)}
            buttonStyle={{ flex: 1, marginEnd: 5, borderRadius: 0 }}
            textStyle={{ fontSize: 16 }}
          />
          <SubmitButton
            disable={currentStore.debt === 0}
            title="Trả nợ"
            onPress={() => this.onPayDebt(false)}
            buttonStyle={{ flex: 1, marginStart: 5, borderRadius: 0 }}
            textStyle={{ fontSize: 16 }}
          />
        </View>
      </View>
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
        keyboardShouldPersistTaps="always"
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
      <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
        <View style={styles.containerStyle}>{this.renderContent()}</View>
        <View style={{ flex: 2 }}>{this.renderDetail()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 3,
    borderWidth: 1,
    borderColor: Style.color.lightBorder,
    marginEnd: 10
  },
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
  },
  detailContainerStyle: {
    backgroundColor: Style.color.white,
    borderWidth: 1,
    borderColor: Style.color.lightBorder,
    padding: 8,
    marginBottom: 10
  },
  textStyle: {
    ...Style.blackTitle,
    textAlign: 'center',
    width: '100%'
  }
});

export default connect(
  state => ({
    products: state.detail.products,
    pageIndex: state.store.pageIndex,
    currentStore: state.store.currentStore,
    total: state.detail.totalProduct,
    skip: state.detail.skipProduct
  }),
  {
    loadStoreProduct,
    setPaybackQuantity,
    loadStoreProductDetail,
    returnProduct,
    loadStore,
    updateStore,
    loadStoreInfo,
    setCurrentStore
  }
)(DetailInfo);
