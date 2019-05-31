import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  StatusBar,
  DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';

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
import { Style, MenuBar, LoadingModal } from '../../components';
import LOAD_NUMBER from '../../utils/System';

class SaleScreen extends React.Component {
  state = {
    zIndex: 3
  };
  componentDidMount() {
    const { loadStore, setPrinterConnect } = this.props;

    setTimeout(() => {
      loadStore({ success: id => this.onStoreItemPress(id) });
    }, 100);

    DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
      setPrinterConnect(false);
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    // this.focusListener.remove();
    DeviceEventEmitter.removeListener(BluetoothManager.EVENT_CONNECTION_LOST);
  }

  onStoreItemPress = id => {
    const { setCurrentStore, loadStoreProduct } = this.props;
    this.setState({ zIndex: 1 });
    setCurrentStore(id);
    // loadNewStore();
    loadStoreProduct({ id, skip: 0, limit: LOAD_NUMBER, shouldRemoveEmpty: true });
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
            <View style={styles.storeViewContainer}>
              <View
                style={{
                  flex: 1,
                  zIndex: this.state.zIndex,
                  backgroundColor: Style.color.background
                }}
              >
                <StoreSelect onStorePress={this.onStoreItemPress} />
              </View>
              <View style={styles.priceContainer}>
                <PriceSelect onSubmit={() => this.setState({ zIndex: 3 })} />
              </View>
            </View>
            <View style={{ flex: 3, flexDirection: 'row', marginStart: 10 }}>
              {/* <View style={styles.priceContainer}>
                <PriceSelect />
              </View> */}

              <View style={styles.detailContainer}>
                <View style={{ flex: 1 }}>
                  <Detail />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
        <LoadingModal visible={this.props.loading || this.props.storeLoading} />
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
  storeViewContainer: {
    flex: 5,
    backgroundColor: Style.color.white,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden'
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
    flex: 6,
    backgroundColor: Style.color.white,
    borderRadius: 10,
    marginBottom: 10
  }
});

export default connect(
  state => ({
    stores: state.store.stores,
    productBills: state.bill.productBills,
    currentStore: state.store.currentStore,
    loading: state.bill.loading,
    showDialog: state.app.showDialog,
    dialogType: state.app.dialogType
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
