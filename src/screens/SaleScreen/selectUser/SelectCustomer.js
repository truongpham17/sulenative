import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import { getCustomer, clearCustomerList } from '../../../actions';
import { Style } from '../../../components';
import { SubmitButton } from '../../../components/button';


class SelectCustomer extends React.Component {
  state = {
    search: ''
  };
  onSubmitEditing = () => {
    const { search } = this.state;
    this.props.getCustomer({ search });
  }

  onShowAll = () => {
    this.props.getCustomer({ search: '' });
  }

  onSelectCustomer = item => {
    this.props.onSelectCustomer(item);
  }

  clearCustomerSearch = () => {
    this.props.clearCustomerList();
    this.setState({
      search: ''
    });
  }

  renderItem = ({ item }) => (
      <TouchableOpacity style={styles.customerItem} onPress={() => this.onSelectCustomer(item)}>
        <Text style={Style.normalDarkText}>{item.username}</Text>
        <Text style={Style.normalDarkText}>{item.phone}</Text>
      </TouchableOpacity>
    )

  render() {
    const { customerList } = this.props;
    return (
      <View>
        <View style={{ flexDirection: 'row', marginEnd: 20, alignItems: 'center' }}>
          <View style={{ width: 280 }}>
            <SearchBar
              platform="ios"
              inputContainerStyle={{ height: 30 }}
              onChangeText={search => this.setState({ search })}
              onClear={() => this.clearCustomerSearch()}
              value={this.state.search}
              placeholder={'Tên khách hàng'}
              inputStyle={Style.normalDarkText}
              onSubmitEditing={this.onSubmitEditing}
            />
          </View>
          <SubmitButton title="Hiện tất cả" onPress={this.onShowAll} buttonStyle={{ flex: 1 }} />
        </View>
        <FlatList
          data={customerList}
          renderItem={this.renderItem}
        />
      </View>


    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: Style.color.darkGray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleStyle: {
    ...Style.normalLightText
  },
  textInputStyle: {
    borderBottomWidth: 1,
    borderBottomColor: Style.color.white,
  },
  customerItem: {
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Style.color.blackBlue,
    marginEnd: 20,
    marginTop: 10,
    borderRadius: 4
  }
});

export default connect(state => ({
  customerList: state.customer.customerList
}), { getCustomer, clearCustomerList })(SelectCustomer);
