import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import RightPanel from './RightPanel/RightPanel';
import { loadListBill, loadBillDetail } from '../../actions';
import { LeftPanel, Style } from '../../components';
import { getDate } from '../../utils/Date';
import { formatPrice } from '../../utils/String';
import MenuIcon from '../../components/MenuIcon';

class HistoryScreen extends React.Component {
  state = {
    refreshing: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    // loadListBill({ skip: 0, limit: 20 });
    this.focusListener = navigation.addListener('didFocus', () => this.onLoadBill(null));
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  onPress = id => {
    const { loadBillDetail } = this.props;
    loadBillDetail(id);
  };

  onLongPress = () => {};

  onEndReached = () => {
    const { skip, total, loadListBill } = this.props;
    if (Math.max(skip, 20) >= total) return;
    loadListBill({ skip: skip === 0 ? 20 : skip, isContinue: true });
  };

  onLoadBill = id => {
    console.log(id);
    const { loadListBill } = this.props;
    this.setState({ refreshing: true });
    loadListBill(
      { skip: 0, billId: id },
      {
        success: () => this.setState({ refreshing: false }),
        failure: () => this.setState({ refreshing: false })
      }
    );
  };

  extractData = () => {
    console.log('extractData');
    const { listBill } = this.props;
    return listBill.map(item => ({
      name: item.id,
      date: getDate(item.createdAt),
      info1: `Tổng: ${formatPrice(item.totalPrice)}`,
      info2: item.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Ghi nợ',
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
        />
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Style.color.background }}>
          <View style={{ flex: 3, margin: 10, borderRadius: 10, backgroundColor: 'white' }}>
            <LeftPanel
              title="Chọn hoá đơn"
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
              onSubmitSearch={id => this.onLoadBill(id)}
            />
          </View>
          <RightPanel containerStyle={styles.rightPanelContainer} />
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
    total: state.sellHistory.total
  }),
  { loadListBill, loadBillDetail }
)(HistoryScreen);
