import React from 'react';
import { View, StyleSheet, Text, AlertIOS, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Button, SearchBar } from 'react-native-elements';
import Modal from 'react-native-modal';
import { PriceItemNew } from './components';
import { EmptyStatus, Style } from '../../components';
import { Store, ProductBill } from '../../models';
import {
  setCurrentProductBills,
  setQuantity,
  setProductBill,
  setProductReturn,
  setDiscount,
  loadStoreProduct,
  importProduct
} from '../../actions';
import LOAD_NUMBER from '../../utils/System';
import { SubmitButton } from '../../components/button';
import { AlertInfo } from '../../utils/Dialog';
import { formatPrice } from '../../utils/String';

type PropsType = {
  currentStore: Store,
  currentProductBills: ProductBill,
  setQuantity: () => null,
  isSell: boolean,
  productBills: ProductBill[]
};

class PriceSelect extends React.Component<PropsType> {
  state = {
    refreshing: false,
    modalVisible: false,
    importPrice: '0',
    exportPrice: '0',
    quantity: '0',
    search: '',
    filter: '',
    selectedProduct: null
  };
  onQuantityChange = (productBill, value, isSubmit) => {
    const { isSell } = this.props;
    // if (value === 0) return;

    if (isSubmit) {
      const product = isSell
        ? { ...productBill, soldQuantity: value, paybackQuantity: 0 }
        : { ...productBill, paybackQuantity: value, soldQuantity: 0 };
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
    if (Math.max(skip, LOAD_NUMBER) >= total || loading) return;
    loadStoreProduct({
      id: currentStore.id,
      skip: skip === 0 ? LOAD_NUMBER : skip,
      isContinue: true
    });
  };

  onAddNewProduct = () => {
    const { importPrice, exportPrice, quantity } = this.state;
    const { loadStoreProduct, currentStore, importProduct } = this.props;
    if (parseInt(importPrice, 10) <= 0 || parseInt(quantity, 10) <= 0) {
      AlertInfo('Vui lòng nhập thông tin chính xác');
      return;
    }
    importProduct(
      {
        storeId: currentStore.id,
        productList: [{ importPrice, exportPrice, quantity }],
        shoudSaveAsHistory: false
      },
      {
        success: () => {
          this.setState({ modalVisible: false });
          loadStoreProduct({ id: currentStore.id, skip: 0, limit: LOAD_NUMBER });
        },
        failure: () => AlertInfo('Thất bại!', 'Vui lòng thử lại')
      }
    );
  };

  onCardPress = productBill => {
    this.setState({
      selectedProduct: productBill,
      modalVisible: true
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

  keyExtractor = item => `${item.id} - ${item.soldQuantity}`;

  getData = () => {
    const { currentProductBills } = this.props;
    const { filter } = this.state;
    if (!filter) {
      return currentProductBills;
    }
    return currentProductBills.filter(item => item.product.exportPrice === parseInt(filter, 10));
  };

  renderItem = ({ item }) => (
    <PriceItemNew
      productBill={item}
      onQuantityChange={(id, value, isSubmit) => this.onQuantityChange(id, value, isSubmit)}
      onSubmit={data => this.onSubmit(data)}
      isSubmit={this.isSubmit(item.id)}
      isSell={this.props.isSell}
      setDiscount={this.setDiscount}
      onCardPress={this.onCardPress}
    />
  );

  renderContent() {
    const { currentStore } = this.props;
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
        data={this.getData()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        extraData={this.props.isSell}
        onEndReachedThreshold={0.5}
        onEndReached={this.onEndReached}
        style={styles.contentStyle}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        numColumns={3}
      />
    );
  }

  renderAddNewButton = () => (
    <Button
      title="Thêm mới"
      icon={{
        name: 'plus',
        type: 'feather',
        size: 16,
        color: Style.color.white
      }}
      titleStyle={[Style.buttonText]}
      type="solid"
      onPress={() => this.setState({ modalVisible: true })}
      buttonStyle={{ width: 120, backgroundColor: Style.color.lightBlue, borderRadius: 5 }}
    />
  );

  renderModalContent = () => {
    const { selectedProduct } = this.state;
    if (!selectedProduct) {
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
          <Text style={Style.textEmphasize}>{selectedProduct.product.total} cái</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={Style.normalDarkText}>Giá nhập: </Text>
          <Text style={Style.textEmphasize}>
            {formatPrice(selectedProduct.product.importPrice)}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={Style.normalDarkText}>Giá bán: </Text>
          <Text style={Style.textEmphasize}>
            {formatPrice(selectedProduct.product.exportPrice)}
          </Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={Style.normalDarkText}>Đã bán: </Text>
          <Text style={Style.textEmphasize}>
            {selectedProduct.product.total - selectedProduct.product.quantity} cái
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={Style.normalDarkText}>Còn lại: </Text>
          <Text style={Style.textEmphasize}>{selectedProduct.product.quantity} cái</Text>
        </View>
      </View>
    );
  };

  renderSearchBar = () => (
    <View style={{ width: 240 }}>
      <SearchBar
        platform="ios"
        inputContainerStyle={{ height: 30 }}
        onChangeText={search => this.setState({ search })}
        onClear={() => this.setState({ filter: '' })}
        value={this.state.search}
        placeholder="Giá bán: "
        inputStyle={Style.normalDarkText}
        onSubmitEditing={() => this.setState({ filter: this.state.search })}
      />
    </View>
  );

  render() {
    const { currentStore } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainerStyle}>
          <Text style={Style.blackEmphasizeTitle}>Nguồn hàng: {currentStore.name}</Text>
          {this.renderSearchBar()}
        </View>
        {this.renderContent()}

        <Modal
          isVisible={this.state.modalVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onBackdropPress={() => {
            this.setState({ modalVisible: false });
          }}
          hideModalContentWhileAnimating
          backdropOpacity={0.4}
        >
          {this.renderModalContent()}
        </Modal>
        <SubmitButton
          title="Xong"
          buttonStyle={{ width: 200, alignSelf: 'center', margin: 4, marginTop: 10 }}
          onPress={this.props.onSubmit}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainerStyle: {
    alignItems: 'center',
    height: 64,
    width: '100%',
    backgroundColor: Style.color.darkBackground,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contentStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1
  },
  emptyContainerStyle: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingTop: 10
  },
  modal: {
    marginTop: -260,
    width: '30%',
    height: '40%',
    alignSelf: 'center',
    backgroundColor: Style.color.white,
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center'
  },
  itemStyle: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    width: '100%'
  },
  textInputStyle: {
    paddingStart: 4,
    ...Style.textEmphasize,
    width: 120,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    paddingEnd: 4,
    paddingVertical: 2,
    marginEnd: -4
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
    loadStoreProduct,
    importProduct
  }
)(PriceSelect);
