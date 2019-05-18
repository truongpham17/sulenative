import React from 'react';
import { View } from 'react-native';
import Style from './Style';

const Line = ({ color, height }) => (
  <View
    style={{
      width: '100%',
      height: height || 1,
      backgroundColor: color || Style.color.blackBlue,
      marginTop: 4,
      marginBottom: 4
    }}
  />
);

export default Line;
