import { View, Text } from 'react-native';
import React from 'react';
import { Icon } from 'react-native-elements';
import { Style } from '../../../../components';

class EmptyScreen extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Style.color.background
        }}
      >
        <Icon name="list" size={96} type="entypo" color={Style.color.placeholder} />
        <Text
          style={{
            color: Style.color.placeholder,
            fontFamily: 'AvenirNext-Bold',
            fontSize: 32,
            fontWeight: '600'
          }}
        >
          Bạn chưa nhập sản phẩm nào
        </Text>
      </View>
    );
  }
}

export default EmptyScreen;
