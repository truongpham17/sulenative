import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { iOSUIKit } from 'react-native-typography';
class TitleItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={{ height: 32, flexDirection: 'row', alignItems: 'center' }}
        onPress={this.props.onPress}
      >
        <View style={{ width: 14, height: 14, backgroundColor: this.props.color, marginEnd: 12 }} />
        <Text style={iOSUIKit.callout}>{this.props.data}</Text>
      </TouchableOpacity>
    );
  }
}

export default TitleItem;
