import React from 'react';
import { iOSColors } from 'react-native-typography';
import { Header } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { View, Text, AlertIOS } from 'react-native';
import { CancelButton } from '../SaleScreen/components';
import MenuIcon from '../../components/MenuIcon';

import {
  addStore,
  logout,
  loadStore,
  updateStore,
  setCurrentStore,
  importProduct,
  loadStoreProduct,
  loadStoreProductImport,
  removeProductItem
} from '../../actions';
import { LeftPanel, Style } from '../../components';
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

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', this.handleRefresh);
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

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
    addStore({
      name: text,
      totalImportProduct: 0,
      productQuantity: 0
    });
  };

  render() {
    const { currentStore, importProduct, navigation } = this.props;
    const { refreshing } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={Style.lightHeaderTitle}>Nhập hàng</Text>}
          rightComponent={<CancelButton title="Xoá" onPress={this.removeAllItem} />}
          backgroundColor={Style.color.blackBlue}
        />
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Style.color.background }}>
          <View style={{ flex: 3, margin: 10, borderRadius: 10, backgroundColor: 'white' }}>
            <LeftPanel
              containerStyle={{ flex: 1 }}
              title="Chọn nguồn hàng"
              data={this.extractStoreData()}
              onLongPress={this.onLongPress}
              onPress={this.onPress}
              activeId={currentStore ? currentStore.id : ''}
              onAddStore={() => this.showDialog('Nhập tên nguồn hàng', this.addStore)}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          </View>
          <View
            style={{
              flex: 7,
              borderRadius: 10,
              margin: 10,
              marginLeft: 0,
              backgroundColor: 'white',
              overflow: 'hidden'
            }}
          >
            <RightPanel currentStore={currentStore} importProduct={importProduct} />
          </View>
          <Spinner
            visible={this.props.loading || this.props.storeLoading}
            color={iOSColors.tealBlue}
          />
        </View>
      </View>
    );
  }
}

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
    loadStoreProduct,
    loadStoreProductImport,
    removeProductItem
  }
)(ImportScreen);
