import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './Style';
import Style from '../Style';

const SubmitButton = props => {
  const { disable } = props;
  const disableStyle = {
    backgroundColor: Style.color.disableButton
  };
  return (
    <TouchableOpacity
      style={[styles.buttonEditStyle, props.buttonStyle, disable ? disableStyle : {}]}
      onPress={props.onPress}
      disabled={disable}
    >
      <Text style={[styles.buttonTextStyle, props.textStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;
