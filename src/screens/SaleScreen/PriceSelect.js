import React from 'react';
import { View, StyleSheet, Text, AlertIOS, FlatList, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import { PriceItem } from './components';
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
import { AcceptNumber } from '../../utils/Number';
import { SubmitButton } from '../../components/button';
import { AlertInfo } from '../../utils/Dialog';

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
    quantity: '0'
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
    if (Math.max(skip, LOAD_NUMBER) >= total || loading) return;
    loadStoreProduct({
      id: currentStore.id,
      skip: skip === 0 ? LOAD_NUMBER : skip,
      isContinue: true
    });
  };

  onAddNewProduct = () => {
    const { importPrice, exportPrice, quantity } = this.state;
    const { loadStoreProduct, currentStore , importProduct} = this.props;
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
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

  renderModalContent = () => (
    <View style={styles.modal}>
      <Text style={[Style.bigTextEmphasize, { textAlign: 'center' }]}>Thêm sản phẩm</Text>
      <View style={styles.itemStyle}>
        <Text style={Style.normalDarkText}>Giá nhập: </Text>
        <TextInput
          style={styles.textInputStyle}
          value={this.state.importPrice}
          onChangeText={text => this.setState({ importPrice: AcceptNumber(text) })}
        />
      </View>
      <View style={styles.itemStyle}>
        <Text style={Style.normalDarkText}>Giá bán: </Text>
        <TextInput
          style={styles.textInputStyle}
          value={this.state.exportPrice}
          onChangeText={text => this.setState({ exportPrice: AcceptNumber(text) })}
        />
      </View>
      <View style={styles.itemStyle}>
        <Text style={Style.normalDarkText}>Số lượng: </Text>
        <TextInput
          style={styles.textInputStyle}
          value={this.state.quantity}
          onChangeText={text => this.setState({ quantity: AcceptNumber(text) })}
        />
      </View>
      <SubmitButton title="Thêm" buttonStyle={{ width: '96%' }} onPress={this.onAddNewProduct} />
    </View>
  );

  render() {
    const { currentStore } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainerStyle}>
          <Text style={Style.blackEmphasizeTitle}>Chọn số lượng</Text>
          {currentStore.isDefault ? this.renderAddNewButton() : null}
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
    justifyContent: 'space-around'
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
