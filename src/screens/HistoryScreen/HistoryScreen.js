import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import RightPanel from './RightPanel/RightPanel';
import { loadListBill, loadBillDetail, payDebt, setDialogStatus } from '../../actions';
import { LeftPanel, Style, MenuBar } from '../../components';
import { getDate } from '../../utils/Date';
import { formatPrice } from '../../utils/String';
import MenuIcon from '../../components/MenuIcon';
import LOAD_NUMBER from '../../utils/System';
import { CancelButton } from '../SaleScreen/components';

class HistoryScreen extends React.Component {
  state = {
    refreshing: false
  };

  componentDidMount() {
    this.onLoadBill(null);
    // this.focusListener = navigation.addListener('didFocus', () => this.onLoadBill(null));
  }

  componentWillUnmount() {
    // Remove the event listener
    // this.focusListener.remove();
  }

  onPress = id => {
    const { loadBillDetail } = this.props;
    loadBillDetail(id);
  };

  onSuccess = id => {
    const { loadBillDetail, setDialogStatus } = this.props;
    loadBillDetail(id);
    setDialogStatus({
      showDialog: true,
      dialogType: 'success'
    });

    console.log('success');
  };

  onLongPress = () => { };

  onEndReached = () => {
    const { skip, total, loadListBill } = this.props;
    if (Math.max(skip, LOAD_NUMBER) >= total) return;
    loadListBill({ skip: skip === 0 ? LOAD_NUMBER : skip, isContinue: true });
  };

  onScanningBill = () => {
    const { navigation } = this.props;
    navigation.navigate('ScanningBarCode', { onScanningSuccess: (id) => this.onPress((`0000${id}`).slice(-5)) });
  }

  onLoadBill = (search, isSearchByName) => {
    const { loadListBill } = this.props;
    this.setState({ refreshing: true });
    loadListBill(
      { skip: 0, search, isSearchByName },
      {
        success: () => this.setState({ refreshing: false }),
        failure: () => this.setState({ refreshing: false })
      }
    );
  };

  extractData = () => {
    const { listBill } = this.props;
    return listBill.map(item => ({
      name: item.id,
      date: getDate(item.createdAt),
      info1: `Tổng: ${formatPrice(item.totalPrice)}`,
      info2: item.isReturned ? 'Trả hàng' : 'Bán hàng',
      id: item.id
    }));
  };

  render() {
    const { currentBill, navigation } = this.props;
    const { refreshing } = this.state;
    return (
      <View style={styles.containerStyle}>
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={Style.lightHeaderTitle}>Thông tin hoá đơn</Text>}
          backgroundColor={Style.color.blackBlue}
          rightComponent={<CancelButton title="Scan hoá đơn" onPress={() => this.onScanningBill()} />}
        />
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Style.color.background }}>
          <MenuBar navigation={navigation} />
          <View style={{ flex: 3, margin: 10, borderRadius: 10, backgroundColor: 'white' }}>
            <LeftPanel
              title="Hoá đơn"
              containerStyle={{ flex: 1 }}
              data={this.extractData()}
              onLongPress={this.onLongPress}
              onPress={this.onPress}
              activeId={currentBill.id}
              footer={<View />}
              onEndReached={this.onEndReached}
              refreshing={refreshing}
              onRefresh={this.onLoadBill}
              haveSearch
              onAddStore={() => navigation.navigate('SaleScreen')}
              onClear={this.onLoadBill}
              onSubmitSearch={(id, isByName) => this.onLoadBill(id, isByName)}
            />
          </View>
          <RightPanel containerStyle={styles.rightPanelContainer} navigation={navigation} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1
  },
  rightPanelContainer: {
    flex: 7,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    marginStart: 0,
    backgroundColor: Style.color.darkBackground,
    overflow: 'hidden'
  }
});

export default connect(
  state => ({
    listBill: state.sellHistory.listBill,
    currentBill: state.sellHistory.currentBill,
    skip: state.sellHistory.skip,
    total: state.sellHistory.total,
    loading: state.sellHistory.loading
  }),
  { loadListBill, loadBillDetail, payDebt, setDialogStatus }
)(HistoryScreen);
