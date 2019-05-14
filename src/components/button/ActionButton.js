import React from 'react';
import { iOSUIKit } from 'react-native-typography';
import { Button } from 'react-native-elements';
import styles from './Style';

const ActionButton = props => (
  <Button
    title={props.title}
    type="solid"
    buttonStyle={[styles.actionButtonStyle, props.buttonStyle]}
    titleStyle={iOSUIKit.bodyEmphasizedWhite}
    onPress={props.onPress}
  />
);

export default ActionButton;
