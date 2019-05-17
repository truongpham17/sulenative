import React from 'react';
import { View } from 'react-native';
import Style from './Style';

const Line = () => (
  <View
    style={{
      width: '100%',
      height: 1,
      backgroundColor: Style.color.blackBlue,
      marginTop: 4,
      marginBottom: 4
    }}
  />
);

export default Line;