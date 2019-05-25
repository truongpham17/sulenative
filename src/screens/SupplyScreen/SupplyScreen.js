import React from 'react';
import { iOSColors } from 'react-native-typography';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import MenuIcon from '../../components/MenuIcon';
import {
  loadStore,
  updateStore,
  setCurrentStore,
  setProductDetail,
  loadStoreInfo,
  addStore,
  loadStoreProductDetail,
  loadStoreHistoryDetail
} from '../../actions';
import { LeftPanel, Style } from '../../components';
import RightPanel from './RightPanel/RightPanel';
import { getDate } from '../../utils/Date';
import { Store } from '../../models';
import { Promt } from '../../utils/Dialog';

type PropsType = {
  currentStore: Store
};

class SupplyScreen extends React.Component<PropsType> {
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
    const { loadStoreInfo, loadStoreProductDetail, loadStoreHistoryDetail } = this.props;
    // setCurrentStore(id);
    loadStoreInfo(id);
    loadStoreProductDetail({ id, skip: 0 });
    loadStoreHistoryDetail({ id, skip: 0 });
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

  showDialog = (title, action) => {
    Promt(title, null, 'Huỷ', 'Thêm', action);
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

  addStore = text => {
    const { addStore } = this.props;
    addStore({
      name: text,
      totalImportProduct: 0,
      productQuantity: 0
    });
  };

  updateStore = (id, name) => {
    const { updateStore } = this.props;
    if (updateStore) {
      updateStore({ id, name });
    }
  };

  render() {
    const { currentStore, navigation } = this.props;
    const { refreshing } = this.state;
    return (
      <View style={styles.containerStyle} behavior="padding">
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={Style.lightHeaderTitle}>Thông tin nguồn hàng</Text>}
          backgroundColor={Style.color.blackBlue}
        />
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Style.color.background }}>
          <View
            style={{
              flex: 3,
              margin: 10,
              borderRadius: 10,
              backgroundColor: Style.color.white
            }}
          >
            <LeftPanel
              title="Chọn nguồn hàng"
              containerStyle={{ flex: 1 }}
              data={this.extractStoreData()}
              onLongPress={this.onLongPress}
              onPress={this.onPress}
              activeId={currentStore ? currentStore.id : ''}
              footer={<View />}
              refreshing={refreshing}
              onAddStore={() => this.showDialog('Nhập tên nguồn hàng', this.addStore)}
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
            <RightPanel />
          </View>
          <Spinner visible={this.props.loading} color={iOSColors.tealBlue} />
        </View>
      </View>
    );
  }
}

export default connect(
  state => ({
    currentStore: state.store.currentStore,
    stores: state.store.stores,
    loading: state.detail.loading
  }),
  {
    setCurrentStore,
    loadStore,
    updateStore,
    setProductDetail,
    loadStoreInfo,
    addStore,
    loadStoreProductDetail,
    loadStoreHistoryDetail
  }
)(SupplyScreen);

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1
  }
});
