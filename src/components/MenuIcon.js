import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import Style from './Style';

const OptionIcon = props => (
  <View style={{ position: 'absolute', top: 24, left: 10, zIndex: 4 }}>
    <Icon
      containerStyle={{ width: 32, height: 32 }}
      name="menu"
      type="feather"
      size={28}
      color={Style.color.white}
      onPress={() => props.navigation.openDrawer()}
      underlayColor="transparent"
    />
  </View>
);
export default OptionIcon;
