import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { iOSColors } from 'react-native-typography';
import { connect } from 'react-redux';
import RowTable from '../../../../components/RowTable';
import { loadStoreHistoryDetail } from '../../../../actions';
import { printBill } from '../../../../utils/Printer';
import { Title, Style, Footer } from '../../../../components';
import { getDate, getDatePrinting } from '../../../../utils/Date';
import { formatPrice } from '../../../../utils/String';
import { Alert } from '../../../../utils/Dialog';
import EmptyScreen from '../../../../components/EmptyStatus';
import LOAD_NUMBER from '../../../../utils/System';

const title = ['STT', 'Ngày nhập', 'Số lượng nhập', 'Tổng vốn', 'Ghi chú'];

class History extends React.Component {
  onEndReached = () => {
    const { loadStoreHistoryDetail, currentStore, skip, total } = this.props;
    if (Math.max(skip, LOAD_NUMBER) >= total) return;
    loadStoreHistoryDetail({
      id: currentStore.id,
      skip: skip === 0 ? LOAD_NUMBER : skip,
      isContinue: true
    });
  };

  keyExtractor = item => item.date;

  alertPrint = (productList, date) => {
    Alert('In hoá đơn?', '', 'Đóng', 'In hoá đơn', () => this.printBill(productList, date));
  }

  printBill = (productList, date) => {
    const { user, currentStore } = this.props;
    let totalQuantity = 0;
    let totalCost = 0;
    productList.forEach(item => {
      totalQuantity += parseInt(item.quantity, 10);
      totalCost += parseInt(item.product.importPrice, 10) * parseInt(item.quantity, 10);
    });


    printBill({
      customerName: currentStore.name,
      thungan: user.fullname,
      date: getDatePrinting(date),
      productList: productList.map(item => ({
        quantity: item.quantity,
        price: item.product.importPrice
      })),
      totalQuantity,
      totalCost,
      discount: 0,
      otherCost: 0,
      // eslint-disable-next-line no-mixed-operators
      preCost: totalCost,
      type: 'import',
      isImport: true
    });
  }

  renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => this.alertPrint(item.productList, item.date)}>
      <RowTable>
        <Text style={Style.normalDarkText}>{index + 1}</Text>
        <Text style={Style.normalDarkText}>{getDate(item.date)}</Text>
        <Text style={Style.normalDarkText}>{item.quantity} cái</Text>
        <Text style={Style.normalDarkText}>{formatPrice(item.totalPrice)}</Text>
        <Text style={Style.normalDarkText}>{item.note}</Text>
      </RowTable>
    </TouchableOpacity>
  );

  renderFooter() {
    const { totalQuantity, totalPrice } = this.props;

    return <Footer data={['Tổng cộng', '', `${totalQuantity} cái`, formatPrice(totalPrice), '']} />;
  }

  render() {
    const { histories, currentStore } = this.props;
    if (!currentStore || !currentStore.id || currentStore.id.length === 0) {
      return <EmptyScreen label="Vui lòng chọn nguồn hàng" />;
    }

    if (!currentStore.totalFund || currentStore.totalFund === 0) {
      return <EmptyScreen label="Nguồn hàng này chưa có sản phẩm" />;
    }
    return (
      <View style={styles.containerStyle}>
        <Title data={title} />
        <FlatList
          data={histories}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onEndReachedThreshold={1}
          onEndReached={this.onEndReached}
        />
        {this.renderFooter()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: { flex: 1 },
  shadowStyle: {
    shadowColor: iOSColors.gray,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.8,
    backgroundColor: Style.color.white
  }
});

export default connect(
  state => ({
    pageIndex: state.store.pageIndexHistory,
    currentStore: state.store.currentStore,
    histories: state.detail.histories,
    skip: state.detail.skipHistory,
    total: state.detail.totalHistory,
    totalQuantity: state.detail.totalQuantity,
    totalPrice: state.detail.totalPrice,
    user: state.user.info,
  }),
  { loadStoreHistoryDetail }
)(History);
