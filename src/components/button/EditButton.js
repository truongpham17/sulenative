import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './Style';

const EditButton = props => (
  <TouchableOpacity style={[styles.buttonEditStyle, props.buttonStyle]} onPress={props.onPress}>
    <Text style={[styles.buttonTextStyle, props.textStyle]}>{props.title}</Text>
  </TouchableOpacity>
  // <Button
  //   title={props.title}
  //   buttonStyle={[styles.buttonEditStyle, props.buttonStyle]}
  //   type="outline"
  //   onPress={props.onPress}
  //   titleStyle={[styles.buttonTextStyle, props.textStyle]}
  // />
);

export default EditButton;
