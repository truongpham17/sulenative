import { View, Text } from 'react-native';
import React from 'react';
import { Icon } from 'react-native-elements';
import { Style } from '.';

class EmptyScreen extends React.PureComponent {
  render() {
    const { textStyle, containerStyle, icon } = this.props;
    return (
      <View
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Style.color.white
          },
          containerStyle
        ]}
      >
        <Icon name="list" size={96} type="entypo" color={Style.color.placeholder} {...icon} />
        <Text style={[Style.placeholderText, { fontSize: 32 }, textStyle]}>{this.props.label}</Text>
      </View>
    );
  }
}

export default EmptyScreen;
