import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Input, Icon } from 'react-native-elements';
import { Style } from '../../components';

class CustomerInfo extends React.Component {
  state = { showFull: false };

  render() {
    const { onChangeText, name, phone, address } = this.props;
    const { showFull } = this.state;
    if (!showFull) {
      return (
        <TouchableOpacity
          onPress={() => this.setState({ showFull: !showFull })}
          style={[styles.containerStyle, { paddingVertical: 15 }]}
          behavior="padding"
        >
          <Text style={[Style.buttonText, { fontSize: 16 }]}>+ Nhập khách hàng</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.containerStyle]} behavior="padding">
        <TouchableWithoutFeedback onPress={() => this.setState({ showFull: false })}>
          <View style={styles.floatingView}>
            <Icon name="minus" color={Style.color.white} type="feather" />
            <Text style={[Style.textLightEmphasize, { marginStart: 8 }]}>Thu nhỏ</Text>
          </View>
        </TouchableWithoutFeedback>
        <Input
          leftIcon={{ name: 'user', size: 21, type: 'feather', color: Style.color.white }}
          inputContainerStyle={styles.textInputStyle}
          inputStyle={[Style.normalLightText, { marginTop: 5, fontSize: 17 }]}
          placeholderTextColor={Style.color.white}
          leftIconContainerStyle={{ marginRight: 10, marginLeft: 0 }}
          onChangeText={text => onChangeText(text, 'customerName')}
          value={name}
          placeholder="Tên khách hàng"
        />
        <Input
          leftIcon={{ name: 'phone', size: 21, type: 'feather', color: Style.color.white }}
          inputContainerStyle={styles.textInputStyle}
          placeholderTextColor={Style.color.white}
          inputStyle={[Style.normalLightText, { marginTop: 5, fontSize: 17 }]}
          leftIconContainerStyle={{ marginRight: 10, marginLeft: 0 }}
          onChangeText={text => onChangeText(text, 'customerPhone')}
          value={phone}
          placeholder="Số điện thoại"
          keyboardType="numeric"
        />
        <Input
          leftIcon={{ name: 'map-pin', size: 21, type: 'feather', color: Style.color.white }}
          inputStyle={[Style.normalLightText, { marginTop: 5, fontSize: 17 }]}
          inputContainerStyle={styles.textInputStyle}
          placeholderTextColor={Style.color.white}
          leftIconContainerStyle={{ marginRight: 10, marginLeft: 0 }}
          onChangeText={text => onChangeText(text, 'customerAddress')}
          value={address}
          placeholder="Địa chỉ"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7986cb'
  },
  titleStyle: {
    ...Style.normalLightText
  },
  textInputStyle: {
    borderBottomWidth: 1,
    borderBottomColor: Style.color.white,
    padding: 0
  },
  floatingView: {
    position: 'absolute',
    right: 0,
    top: -32,
    height: 32,
    width: 140,
    backgroundColor: '#7986cb',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
});

export default CustomerInfo;
