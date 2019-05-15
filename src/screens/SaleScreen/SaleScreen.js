import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Text, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
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
  loadNewStore
} from '../../actions';
import MenuIcon from '../../components/MenuIcon';
import { Style } from '../../components';
import { iOSColors } from 'react-native-typography';
import Printer from '../../components/Printer';

class SaleScreen extends React.Component {
  componentDidMount() {
    const { navigation, loadStore } = this.props;
    this.focusListener = navigation.addListener('didFocus', this.handleRefresh);

    setTimeout(() => {
      loadStore();
    }, 100);
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  onStoreItemPress = id => {
    const { setCurrentStore, loadStoreProduct, loadNewStore } = this.props;
    setCurrentStore(id);
    loadNewStore();
    loadStoreProduct({ id, skip: 0, limit: 20 });
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
          rightComponent={<CancelButton title="Huỷ đơn hàng" onPress={this.closeBill} />}
          backgroundColor={Style.color.blackBlue}
        />
        <KeyboardAvoidingView style={styles.mainContainer} behavior="padding">
          <View style={styles.storeViewContainer}>
            <StoreSelect onStorePress={this.onStoreItemPress} />
          </View>
          <View style={{ flex: 9, flexDirection: 'row' }}>
            <View style={styles.priceContainer}>
              <PriceSelect />
            </View>

            <View style={styles.detailContainer}>
              <View style={{ flex: 1 }}>
                <Detail />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        <Spinner
          visible={this.props.loading || this.props.storeLoading}
          color={iOSColors.tealBlue}
        />
        <Printer />
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
    flex: 5,
    borderRadius: 10,
    backgroundColor: Style.color.white,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden'
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
    loading: state.bill.loading
  }),
  { logout, loadStore, closeBill, submitBill, setCurrentStore, loadStoreProduct, loadNewStore }
)(SaleScreen);
