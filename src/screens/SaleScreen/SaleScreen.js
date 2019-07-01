import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { Header } from 'react-native-elements';

import { CancelButton } from './components';
import { SelectUser } from './selectUser';
import Detail from './Detail';
import {
  logout,
  loadStore,
  closeBill,
  submitBill,
  setCurrentStore,
  loadStoreProduct,
  loadNewStore,
  setPrinterConnect,
  addProductBill,
  setCustomer,
} from '../../actions';
import MenuIcon from '../../components/MenuIcon';
import { Style, MenuBar, Calculator, StoreHeader } from '../../components';
import LOAD_NUMBER from '../../utils/System';
import { SubmitButton } from '../../components/button';

class SaleScreen extends React.Component {

  state = {
    selectUserModalVisible: false
  }

  componentDidMount() {
    const { loadStore, printerURL, setPrinterConnect } = this.props;

    setTimeout(() => {
      loadStore();
    }, 100);
  }

  onSubmitItem = (data: { quantity: Number, importPrice: Number, exportPrice: Number, discount: Number }) => {
    const { addProductBill, currentStore, isSell } = this.props;
    addProductBill({
      ...data,
      store: { storeId: currentStore.id, storeName: currentStore.name },
      isSell
    });
  }


  onStoreItemPress = id => {
    const { setCurrentStore, loadStoreProduct, defaultStore } = this.props;
    setCurrentStore(id);


    setTimeout(() => {
      loadStoreProduct({
        id, skip: 0, limit: LOAD_NUMBER, isDefaultStore: id === defaultStore.id
        // , shouldRemoveEmpty: true
      });
    }, 100);
    // loadNewStore();
  };

  onSelectCustomer = customer => {
    this.props.setCustomer(customer);
    this.setState({
      selectUserModalVisible: false
    });
  }

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
    const { navigation, currentStore, isSell } = this.props;
    return (
      /*
          
      */
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        <Modal
          isVisible={this.state.selectUserModalVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onBackdropPress={() => this.setState({ selectUserModalVisible: false })}
          backdropOpacity={0.4}
        >
          <SelectUser onSelectCustomer={this.onSelectCustomer} />
        </Modal>
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={Style.lightHeaderTitle}>Tạo đơn hàng</Text>}
          rightComponent={<CancelButton title="Xoá" onPress={this.closeBill} />}
          backgroundColor={Style.color.blackBlue}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <MenuBar navigation={navigation} />
          <View style={styles.mainContainer} >
            <View style={{ flex: 4 }}>
              <StoreHeader />
              <Calculator onSubmitItem={data => this.onSubmitItem(data)} haveImportPrice={currentStore.isDefault && isSell} haveDiscount={isSell} />
            </View>
            <View style={styles.detailContainer}>
              <Detail navigation={navigation} onShowUser={() => this.setState({ selectUserModalVisible: true })} />
            </View>
          </View>

        </View>
        {/* <SubmitButton onPress={() => navigation.navigate('ScanningBarCode')} title="click here" /> */}
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
    defaultStore: state.store.defaultStore,
    isSell: state.bill.isSell,
    printerURL: state.user.printerURL
  }),
  {
    logout,
    loadStore,
    closeBill,
    submitBill,
    setCurrentStore,
    loadStoreProduct,
    loadNewStore,
    setPrinterConnect,
    addProductBill,
    setCustomer
  }
)(SaleScreen);
