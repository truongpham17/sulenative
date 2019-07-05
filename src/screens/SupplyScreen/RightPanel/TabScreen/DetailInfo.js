import React from 'react';
import { View, StyleSheet, Text, FlatList, AlertIOS } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { iOSColors } from 'react-native-typography';
import { Product, ProductBill, Store } from '../../../../models';
import {
  setPaybackQuantity,
  loadStoreProductDetail,
  returnProduct,
  loadStore,
  updateStore,
  loadStoreInfo,
  setCurrentStore,
  updateExportPrice,
  setDialogStatus
} from '../../../../actions';
import { printBill } from '../../../../utils/Printer';
import { getDatePrinting } from '../../../../utils/Date';
import { formatPrice } from '../../../../utils/String';
import DetailItem from '../../components/DetailItem';
import { SubmitButton } from '../../../../components/button';
import { Title, Style, RowTable } from '../../../../components';
import EmptyScreen from '../../../../components/EmptyStatus';
import LOAD_NUMBER from '../../../../utils/System';
import { Promt, AlertInfo } from '../../../../utils/Dialog';

type PropsType = {
  products: ProductBill[],
  currentStore: Store
};

const title = ['Số lượng', 'Giá nhập', 'Giá bán', 'Đã bán', 'Còn lại'];

class DetailInfo extends React.Component<PropsType> {
  state = {
    paybackQuantity: [],
    modalVisible: false,
    selectedId: ''
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

  onChangeExportPrice = (exportPrice, product) => {
    const { updateExportPrice } = this.props;
    updateExportPrice(
      { id: product.id, exportPrice },
      { success: () => { }, failure: () => AlertInfo('Thất bại!') }
    );
  };

  onEndReached = () => {
    const { total, skip, loadStoreProductDetail, currentStore } = this.props;
    if (Math.max(skip, LOAD_NUMBER) >= total) return;
    loadStoreProductDetail({
      id: currentStore.id,
      skip: skip === 0 ? LOAD_NUMBER : skip,
      isContinue: true
    });
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

  onCardPress = id => {
    this.setState({
      modalVisible: true,
      selectedId: id
    });
  };

  onReturnProduct = () => {
    const { products, returnProduct, setDialogStatus } = this.props;
    const checkHaveReturnProduct = products.find(item => item.paybackQuantity > 0);
    const data = !checkHaveReturnProduct
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
            success: (billData) => {
              console.log('bill data: ', billData);
              setTimeout(() => {
                setDialogStatus({
                  showDialog: true,
                  dialogType: 'success'
                });
              }, 1000);
              this.printBill(billData._id, data.productList);
            },
            failure: () =>
              setDialogStatus({
                showDialog: true,
                dialogType: 'failure'
              })
          })
      }
    ]);
  };

  getReturnProductData(products, isAll) {
    console.log(products);
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
        quantity,
        importPrice: item.product.importPrice
      });
      data.totalQuantity += quantity;
      data.totalPrice += quantity * item.product.importPrice;
    });
    return data;
  }

  getInfos = () => {
    const { currentStore } = this.props;
    return {
      totalQuantity: currentStore.totalImportProduct,
      totalImportPrice: currentStore.totalFund,
      soldQuantity: currentStore.totalSoldProduct,
      quantity: currentStore.productQuantity,
      totalSoldMoney: currentStore.totalSoldMoney
    };
  };

  printBill = (id, productList) => {
    const { user, currentStore } = this.props;
    console.log(productList);
    let totalQuantity = 0;
    let totalCost = 0;
    productList.forEach(item => {
      totalQuantity += parseInt(item.quantity, 10);
      totalCost += parseInt(item.importPrice, 10) * parseInt(item.quantity, 10);
    });

    printBill({
      customerName: currentStore.name,
      thungan: user.fullname,
      date: getDatePrinting(),
      productList: productList.map(item => ({
        quantity: item.quantity,
        price: item.importPrice
      })),
      totalQuantity,
      totalCost,
      discount: 0,
      otherCost: 0,
      // eslint-disable-next-line no-mixed-operators
      preCost: totalCost,
      type: 'import',
      id
    });
  }

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
        success: () => setTimeout(() => {
          AlertInfo('Thành công!');
        }, 1000),
        failure: () => setTimeout(() => {
          AlertInfo('Lỗi!', 'Vui lòng thử lại!');
        }, 1000)
      }
    );
  };

  keyExtractor = item => item.id;

  renderItem = ({ item, index }) => (
    <DetailItem
      productBill={item}
      index={index}
      onChangePaybackQuantity={this.onChangePaybackQuantity}
      onChangeExportPrice={this.onChangeExportPrice}
      onCardPress={this.onCardPress}
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

  renderInfoItem = () => {
    const { selectedId } = this.state;
    const { products } = this.props;
    const data = products.find(item => item.id === selectedId);
    if (!data) {
      return <View />;
    }
    return (
      <View
        style={{
          alignSelf: 'center',
          backgroundColor: Style.color.white,
          width: '30%',
          height: '50%',
          justifyContent: 'space-around',
          padding: 10
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={[Style.blackHeaderTitle, { textAlign: 'center' }]}>Thông tin sản phẩm</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={Style.normalDarkText}>Tổng số lượng nhập: </Text>
          <Text style={Style.textEmphasize}>{data.product.total} cái</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={Style.normalDarkText}>Giá nhập: </Text>
          <Text style={Style.textEmphasize}>{formatPrice(data.product.importPrice)}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={Style.normalDarkText}>Giá bán: </Text>
          <Text style={Style.textEmphasize}>{formatPrice(data.product.exportPrice)}</Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={Style.normalDarkText}>Đã bán: </Text>
          <Text style={Style.textEmphasize}>{data.product.total - data.product.quantity} cái</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={Style.normalDarkText}>Còn lại: </Text>
          <Text style={Style.textEmphasize}>{data.product.quantity} cái</Text>
        </View>
      </View>
    );
  };

  renderDetail() {
    const { currentStore } = this.props;
    const data = this.getInfos();
    return (
      <View style={styles.detailContainerStyle}>
        <Text style={styles.textStyle}>Thông tin</Text>
        {this.renderDetailItem('Tên nguồn hàng: ', currentStore.name)}
        {this.renderDetailItem('Đã nhập: ', `${data.totalQuantity} cái`)}
        {this.renderDetailItem('Đã bán: ', `${data.soldQuantity} cái`)}
        {this.renderDetailItem('Còn lại: ', `${data.quantity} cái`)}
        {this.renderDetailItem('Tổng tiền nhập: ', formatPrice(data.totalImportPrice))}
        {this.renderDetailItem('Tổng tiền bán được: ', formatPrice(data.totalSoldMoney))}
        {this.renderDetailItem('Tiền nợ nguồn hàng: ', formatPrice(currentStore.debt))}
        <View style={{ width: '100%', marginTop: 10, flexDirection: 'row' }}>
          <SubmitButton
            title={'Trả hàng'}
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
        keyboardShouldPersistTaps="always"
        numColumns={2}
        style={{ padding: 2 }}
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
        <Modal
          isVisible={this.state.modalVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onBackdropPress={() => this.setState({ modalVisible: false })}
          backdropOpacity={0.4}
        >
          {this.renderInfoItem()}
        </Modal>
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
    skip: state.detail.skipProduct,
    user: state.user.info,
  }),
  {
    setPaybackQuantity,
    loadStoreProductDetail,
    returnProduct,
    loadStore,
    updateStore,
    loadStoreInfo,
    setCurrentStore,
    updateExportPrice,
    setDialogStatus
  }
)(DetailInfo);
