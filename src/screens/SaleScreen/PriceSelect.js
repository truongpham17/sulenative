import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
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
  importProduct,
  addNewProduct
} from '../../actions';
import LOAD_NUMBER from '../../utils/System';
import { SubmitButton } from '../../components/button';
import { AlertInfo } from '../../utils/Dialog';
import AddNewItem from './components/AddNewItem';
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
    selectedProduct: null,
    modalAddNewVisible: false
  };
  onQuantityChange = (productBill, value) => {
    const { isSell } = this.props;

    const product = isSell
      ? { ...productBill, soldQuantity: value, paybackQuantity: 0 }
      : { ...productBill, paybackQuantity: value, soldQuantity: 0 };
    this.onSubmit(product);
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
    const { loadStoreProduct, currentStore, defaultStore } = this.props;
    loadStoreProduct(
      {
        id: currentStore.id,
        skip: 0,
        // shouldRemoveEmpty: true,
isDefaultStore: currentStore.id === defaultStore.id
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

  keyExtractor = item => `${item.id}`;

  getData = () => {
    const { currentProductBills, isSell } = this.props;
    const { search } = this.props;
    if (!search) {
      if(isSell) {
        return currentProductBills.filter(item => item.product.quantity > 0);
      } 
        return currentProductBills
      
    }
    if(isSell) {
      return currentProductBills.filter(item => item.product.exportPrice === parseInt(search, 10) && item.product.quantity > 0);
    }
    return currentProductBills.filter(item => item.product.exportPrice === parseInt(search, 10));
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
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
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

  onAddProduct = (product) => {
    const { addNewProduct, currentStore, isSell } = this.props;
    const id = new Date().toJSON();
    const data = {
      product: {
        importPrice: product.importPrice,
        exportPrice: product.exportPrice,
        quantity: product.quantity,
        soldQuantity: 0,
        total: product.quantity,
        store: {
          id: currentStore.id,
          name: currentStore.name
        }
      },
      soldQuantity: isSell ? product.quantity : 0,
      paybackQuantity: isSell ? 0 : product.quantity,
      discount: 0,
      id
    };
    addNewProduct(data);
  }


  renderAddNewItem = () => (
      <AddNewItem callBack={(value) => { this.onAddProduct(value); this.setState({ modalAddNewVisible: false }); }} />
    )

  render() {
    const { currentStore } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {currentStore.isDefault ? (
          <View style={styles.floatButton}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ modalAddNewVisible: true })}>
              <Icon name="plus" type="feather" color="white" />
              </TouchableOpacity>

          </View>
        ) : null}
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
        <Modal
          isVisible={this.state.modalAddNewVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onBackdropPress={() => {
            this.setState({ modalAddNewVisible: false });
          }}
          hideModalContentWhileAnimating
          backdropOpacity={0.4}
        >
          {this.renderAddNewItem()}
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
  },
  floatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Style.color.lightBlue,
    zIndex: 4,
    shadowOffset: { x: 2, y: 2 },
    shadowColor: Style.color.lightBlue,
    shadowOpacity: 0.3
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
    firstLoading: state.bill.firstLoading,
    defaultStore: state.store.defaultStore
  }),
  {
    setCurrentProductBills,
    setQuantity,
    setProductBill,
    setProductReturn,
    setDiscount,
    loadStoreProduct,
    importProduct,
    addNewProduct
  }
)(PriceSelect);
