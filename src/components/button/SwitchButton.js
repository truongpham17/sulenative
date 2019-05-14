import React from 'react';
import { Button } from 'react-native-elements';
import Style from '../Style';
import styles from './Style';

const SwitchButton = props => (
  <Button
    title={props.title}
    //icon={{ ...props.icon }}
    titleStyle={[
      Style.buttonText,
      { color: props.active ? Style.color.white : Style.color.lightBlue }
    ]}
    type={props.active ? 'solid' : 'outline'}
    buttonStyle={[
      styles.switchButtonStyle,
      props.buttonStyle,
      { backgroundColor: props.active ? Style.color.lightBlue : Style.color.white }
    ]}
    onPress={props.onPress}
  />
);

export default SwitchButton;
