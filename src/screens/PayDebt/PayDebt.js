import React from 'react';
import { View, StyleSheet, Text, FlatList, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { SearchBar, Header } from 'react-native-elements';
import { loadDebtStore, getCustomer, updateStore, addCustomerDebt, setDialogStatus, loadStore } from '../../actions';
import { Style, MenuIcon, MenuBar } from '../../components';
import { SubmitButton } from '../../components/button';
import { formatPrice } from '../../utils/String';
import { Promt, Alert } from '../../utils/Dialog';

class PayDebt extends React.Component {

  state = {
    customer: '',
    store: ''
  }

  onSubmitPayDebt = (item, value) => {
    const { updateStore, addCustomerDebt, debtStore, debtCustomer, setDialogStatus } = this.props;
    if (isNaN(value)) return;
    const intValue = parseInt(value, 10);
    if (item.type === 'store') {
      const debtValue = item.debt - intValue;
      if (debtValue < 0) {
        Alert('Số tiền trả không được nhiều hơn số nợ');
        return;
      }
      updateStore({ id: item.id, debt: debtValue });
    } else {
      const debtValue = item.debt - intValue;
      if (debtValue < 0) {
        Alert('Số tiền trả không được nhiều hơn số nợ');
        return;
      }
      addCustomerDebt({ id: item.id, debt: debtValue });
    }
  }

  onPayDebt = (item) => {
    Promt('Trả nợ', 'Nhập số tiền trả', 'Huỷ', 'Trả nợ', value => this.onSubmitPayDebt(item, value), null, '', 'numeric');
  }

  onSearchCustomer = () => {
    const { getCustomer } = this.props;
    getCustomer({ search: this.state.customer });
  }

  onSearchStore = () => {

  }

  onShowAll = (searchType) => {
    const { loadStore, getCustomer } = this.props;
    if (searchType === 'store') {
      loadStore();
    } else {
      getCustomer({ isDebt: true });
    }
  }


  renderItem = ({ item }) => (<View style={styles.itemStyle}>
      <View>
       {item.data.map(value => <Text style={[Style.normalDarkText, { height: 32 }]}>{value}</Text>)}
      </View>
      <SubmitButton title="Trả nợ" buttonStyle={{ width: 180 }} onPress={() => this.onPayDebt(item)} />
    </View>)


  renderFragment = (data, title, placeholder, searchType, onSubmitEditing) => (
      <View style={styles.fragment}>
        <Text style={[Style.blackTitle, { textAlign: 'center', marginBottom: 10 }]}>{title}</Text>

       <View style={{ flexDirection: 'row', marginEnd: 20, alignItems: 'center' }}>
         <View style={{ width: 280, marginEnd: 10 }}>
            <SearchBar
              platform="ios"
              inputContainerStyle={{ height: 30 }}
              onChangeText={value => this.setState({ [searchType]: value })}
              onClear={() => this.setState({ [searchType]: '' })}
              value={this.state[searchType]}
              placeholder={placeholder}
              inputStyle={Style.normalDarkText}
              onSubmitEditing={onSubmitEditing}
            />
          </View>
         <SubmitButton title="Hiện tất cả" onPress={() => this.onShowAll(searchType)} buttonStyle={{ flex: 1 }} />

        </View>

        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index} `}
        />
      </View>
    )

  render() {
    const { debtStore, debtCustomer, navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={Style.lightHeaderTitle}>Quản lý nợ</Text>}
          backgroundColor={Style.color.blackBlue}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <MenuBar navigation={navigation} />
          <View style={styles.containerStyle}>
            {this.renderFragment(
              debtCustomer.map(
                item =>
                ({ id: item.id, type: 'customer', debt: item.debt, data: [`Tên: ${item.username}`, `SDT: ${item.phone}`, `Nợ: ${formatPrice(item.debt)}`] }))
                , 'Khách hàng', 'Tên khách hàng', 'customer', () => this.onSearchCustomer())}
            {this.renderFragment(
              debtStore.map(
                item =>
                ({ id: item.id, type: 'store', debt: item.debt, data: [`Tên: ${item.name}`, `Nợ: ${formatPrice(item.debt)}`] }))
                , 'Nhà cung cấp', 'Tên nguồn hàng', 'store', null)}
          </View>

        </View>
      </View>
    );
  }
}

export default connect(state => ({
  debtStore: state.store.stores.filter(item => item.debt > 0),
  debtCustomer: state.customer.customerList
}), { loadDebtStore, getCustomer, updateStore, addCustomerDebt, setDialogStatus, loadStore })(PayDebt);

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    paddingStart: 10,
    backgroundColor: Style.color.background
  },
  titleStyle: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    paddingStart: 10,
    backgroundColor: Style.color.darkBackground
  },
  itemStyle: {
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Style.color.blackBlue,
    backgroundColor: Style.color.white,
    marginTop: 10,
    paddingHorizontal: 10
  },
  fragment: {
    flex: 1,
    marginEnd: 10,
    borderWidth: 1,
    borderColor: Style.color.darkGray,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden'
  }
});
