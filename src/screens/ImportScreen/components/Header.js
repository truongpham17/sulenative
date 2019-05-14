import React from 'react';
import { Header } from 'react-native-elements';
import { View, Text } from 'react-native';
import { Style } from '../../../components';

const MyHeader = () => (
  <Header
    leftComponent={
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <Text style={Style.blackHeaderTitle}>Nguồn hàng</Text>
      </View>
    }
    centerComponent={
      <View style={{ flex: 3 }}>
        <Text style={Style.blackHeaderTitle}>Nhập hàng</Text>
      </View>
    }
  />
);

export default MyHeader;
