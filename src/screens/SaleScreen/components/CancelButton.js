import React from 'react';
import { Button } from 'react-native-elements';
import { Style } from '../../../components';

const CancelButton = props => (
  <Button
    title={props.title}
    titleStyle={[Style.normalLightText, { color: Style.color.blackBlue }]}
    buttonStyle={{
      width: 140,
      height: 32,
      backgroundColor: Style.color.lightPink,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0
    }}
    onPress={props.onPress}
  />
);

export default CancelButton;
