import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';

import { CancelButton } from './components';
import StoreSelect from './StoreSelect';
import PriceSelect from './PriceSelect';
import Detail from './Detail';
import {
  logout,
  loadStore,
  closeBill,
  submitBill,
  setCurrentStore,
  loadStoreProduct,
  loadNewStore,
  setPrinterConnect
} from '../../actions';
import MenuIcon from '../../components/MenuIcon';
import { Style, MenuBar } from '../../components';
import LOAD_NUMBER from '../../utils/System';

class SaleScreen extends React.Component {
  componentDidMount() {
    const { loadStore } = this.props;

    setTimeout(() => {
      loadStore();
    }, 100);
  }


  onStoreItemPress = id => {
    const { setCurrentStore, loadStoreProduct, defaultStore } = this.props;
    setCurrentStore(id);


    setTimeout(() => {
      loadStoreProduct({ id, skip: 0, limit: LOAD_NUMBER, isDefaultStore: id === defaultStore.id
      // , shouldRemoveEmpty: true
      });
    }, 100);
    // loadNewStore();
  };

  handleRefresh = () => {
    const { currentStore } = this.props;
    if (currentStore && currentStore.id && currentStore.id.length > 0) {
      this.onStoreItemPress(currentStore.id);
    }
  };

  closeBill = () => {
    const { closeBill } = this.props;
    closeBill();
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={Style.lightHeaderTitle}>Tạo đơn hàng</Text>}
          rightComponent={<CancelButton title="Xoá" onPress={this.closeBill} />}
          backgroundColor={Style.color.blackBlue}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <MenuBar navigation={navigation} />
          <KeyboardAvoidingView style={styles.mainContainer} behavior="padding">
            <StoreSelect onStorePress={this.onStoreItemPress} />
            <View style={styles.detailContainer} behavior="padding">
              <Detail navigation={navigation} />
            </View>
          </KeyboardAvoidingView>

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
    marginStart: 10
  }
});

export default connect(
  state => ({
    stores: state.store.stores,
    productBills: state.bill.productBills,
    currentStore: state.store.currentStore,
    loading: state.bill.loading,
    showDialog: state.app.showDialog,
    dialogType: state.app.dialogType,
    defaultStore: state.store.defaultStore
  }),
  {
    logout,
    loadStore,
    closeBill,
    submitBill,
    setCurrentStore,
    loadStoreProduct,
    loadNewStore,
    setPrinterConnect
  }
)(SaleScreen);
