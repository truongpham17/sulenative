import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { iOSColors } from 'react-native-typography';
import { connect } from 'react-redux';
import RowTable from '../../../../components/RowTable';
import { loadStoreHistoryDetail } from '../../../../actions';
import { Title, Style, Footer } from '../../../../components';
import { getDate } from '../../../../utils/Date';
import { formatPrice } from '../../../../utils/String';
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

  renderItem = ({ item, index }) => (
    <TouchableOpacity>
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
    totalPrice: state.detail.totalPrice
  }),
  { loadStoreHistoryDetail }
)(History);
