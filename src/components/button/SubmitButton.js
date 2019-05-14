import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './Style';

const SubmitButton = props => (
  <TouchableOpacity style={[styles.buttonEditStyle, props.buttonStyle]} onPress={props.onPress}>
    <Text style={[styles.buttonTextStyle, props.textStyle]}>{props.title}</Text>
  </TouchableOpacity>
);

export default SubmitButton;
