import React from 'react';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';
import { View, Text, AlertIOS, StyleSheet } from 'react-native';
import { CancelButton } from '../SaleScreen/components';
import MenuIcon from '../../components/MenuIcon';

import {
  addStore,
  logout,
  loadStore,
  updateStore,
  setCurrentStore,
  importProduct,
  loadStoreProductImport,
  removeProductItem,
  addProductImport
} from '../../actions';
import { Style, MenuBar, Calculator, StoreHeader } from '../../components';
import RightPanel from './RightPanel';
import { Store } from '../../models';
import { getDate } from '../../utils/Date';

type PropsType = {
  stores: Array<Store>,
  addStore: () => Promise,
  error: string,
  updateStore: () => Promise,
  currentStore: number,
  loadStore: () => void
};

class ImportScreen extends React.Component<PropsType> {
  state = {
    refreshing: false
  };

  onLongPress = id => {
    this.showDialog('Nhập tên nguồn hàng', text => this.updateStore(id, text));
  };

  onPress = id => {
    const { setCurrentStore, loadStoreProductImport } = this.props;
    setCurrentStore(id);
    loadStoreProductImport({ id, skip: 0, isContinue: false });
  };

  onRefresh = () => {
    const { loadStore } = this.props;
    this.setState({ refreshing: true });
    loadStore({
      success: () => this.setState({ refreshing: false }),
      failure: () => this.setState({ refreshing: false })
    });
  };

  onSubmitItem = (data: { quantity: Number, importPrice: Number, exportPrice: Number, discount: Number }) => {
    const { addProductImport } = this.props;
    addProductImport(data);
  }

  handleRefresh = () => {
    const { currentStore } = this.props;
    if (currentStore && currentStore.id && currentStore.id.length > 0) {
      this.onPress(currentStore.id);
    }
  };

  extractStoreData = () => {
    const { stores } = this.props;
    const data = stores.map((store: Store) => ({
      name: store.name,
      date: `${getDate(store.createdAt)}`,
      info1: `Nhập: ${store.totalImportProduct} sp`,
      info2: `Còn: ${store.productQuantity} sp`,
      id: store.id
    }));
    return data;
  };

  updateStore = (id, name) => {
    const { updateStore } = this.props;
    if (updateStore) {
      updateStore({ id, name });
    }
  };

  showDialog = (title, action) => {
    AlertIOS.prompt(title, null, [
      {
        text: 'Huỷ',
        style: 'cancel'
      },
      {
        text: 'Thêm',
        onPress: text => action(text)
      },
      'plain-text'
    ]);
  };

  removeAllItem = () => {
    const { removeProductItem } = this.props;
    removeProductItem();
  };

  addStore = text => {
    const { addStore } = this.props;
    this.showDialog('Nợ cũ', debt =>
    addStore({
      name: text,
      totalImportProduct: 0,
      productQuantity: 0,
      debt: parseInt(debt, 10) || 0
    }));
  };

  render() {
    const { currentStore, importProduct, navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={Style.lightHeaderTitle}>Nhập hàng</Text>}
          rightComponent={<CancelButton title="Xoá" onPress={this.removeAllItem} />}
          backgroundColor={Style.color.blackBlue}
        />

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <MenuBar navigation={navigation} />
          <View style={styles.mainContainer}>
            <View style={{ flex: 4 }}>
              <StoreHeader haveExportType={false} removeDefaultStore haveAddNew onAddStore={() => this.showDialog('Tên nguồn hàng', text => this.addStore(text))} />
              <Calculator haveImportPrice onSubmitItem={data => this.onSubmitItem(data)} />
            </View>
            <View style={styles.detailContainer} >
              <RightPanel currentStore={currentStore} importProduct={importProduct} navigation={this.props.navigation} />
            </View>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Style.color.background,
    padding: 10
  },
  store: {
    flex: 1,
    backgroundColor: Style.color.white
  },
  storeViewContainer: {
    flex: 6,
    backgroundColor: Style.color.white,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  priceContainer: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    backgroundColor: Style.color.white,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  detailContainer: {
    flex: 3,
    backgroundColor: Style.color.white,
    borderRadius: 10,
    marginBottom: 10,
    marginStart: 10,
  }
});

export default connect(
  state => ({
    stores: state.store.stores,
    currentStore: state.store.currentStore,
    error: state.store.error,
    productLoading: state.importProduct.loading,
    storeLoading: state.store.loading,
    products: state.importProduct.products
  }),
  {
    addStore,
    logout,
    loadStore,
    updateStore,
    setCurrentStore,
    importProduct,
    loadStoreProductImport,
    removeProductItem,
    addProductImport
  }
)(ImportScreen);
