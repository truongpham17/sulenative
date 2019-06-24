import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { Input } from 'react-native-elements';
import { Style } from '../../../components';

class NewCustomer extends React.Component {

  state = {
    username: '',
    phone: '',
    address: '',
    error: ''
  }

  componentDidMount() {
    const { customer } = this.props;
    this.setState({
      username: customer.username || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
  }

  onChangeText = (text, type) => {
    this.setState({ [type]: text, error: '' });
  }

  onSubmit = () => {
    if (this.state.username.length > 0) {
      this.props.onSelectCustomer({ ...this.state, isNew: true });
    } else {
      this.setState({
        error: 'Vui lòng nhập tên'
      });
    }
  }

  render() {
    const { username, phone, address } = this.state;
    return (
      <View style={{ marginEnd: 20, height: 200, paddingTop: 10 }}>
        <View style={[styles.containerStyle]}>
        <Input
          leftIcon={{ name: 'user', size: 21, type: 'feather', color: Style.color.white }}
          inputContainerStyle={styles.textInputStyle}
          inputStyle={[Style.normalLightText, { marginTop: 5, fontSize: 17 }]}
          placeholderTextColor={Style.color.white}
          leftIconContainerStyle={{ marginRight: 10, marginLeft: 0 }}
          onChangeText={text => this.onChangeText(text, 'username')}
          value={username}
          placeholder="Tên khách hàng"
          autoCorrect={false}
          errorMessage={this.state.error}
        />
        <Input
          leftIcon={{ name: 'phone', size: 21, type: 'feather', color: Style.color.white }}
          inputContainerStyle={styles.textInputStyle}
          placeholderTextColor={Style.color.white}
          inputStyle={[Style.normalLightText, { marginTop: 5, fontSize: 17 }]}
          leftIconContainerStyle={{ marginRight: 10, marginLeft: 0 }}
          onChangeText={text => this.onChangeText(text, 'phone')}
          value={phone}
          placeholder="Số điện thoại"
          keyboardType="numeric"
          autoCorrect={false}
        />
        <Input
          leftIcon={{ name: 'map-pin', size: 21, type: 'feather', color: Style.color.white }}
          inputStyle={[Style.normalLightText, { marginTop: 5, fontSize: 17 }]}
          inputContainerStyle={styles.textInputStyle}
          placeholderTextColor={Style.color.white}
          leftIconContainerStyle={{ marginRight: 10, marginLeft: 0 }}
          onChangeText={text => this.onChangeText(text, 'address')}
          value={address}
          placeholder="Địa chỉ"
          autoCorrect={false}
        />
        </View>
         <TouchableOpacity
          onPress={() => this.onSubmit()}
          style={[styles.containerStyle, { width: '80%', height: 48, backgroundColor: Style.color.blackBlue, alignSelf: 'center', marginTop: 10 }]}
         >
          <Text style={[Style.buttonText, { fontSize: 16 }]}>Xác nhận</Text>
        </TouchableOpacity>
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
  }
});

export default connect(state => ({
  customer: state.bill.customer
}))(NewCustomer);
