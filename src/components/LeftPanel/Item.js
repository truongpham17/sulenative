import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Style from '../Style';

type PropsType = {
  name: string,
  date: string,
  info1: string,
  info2: string,
  onLongPress: () => null,
  onPress: () => null,
  isActive: boolean
};

export default class Item extends React.Component<PropsType> {
  onPress = () => {
    const { onPress } = this.props;
    if (onPress) {
      onPress();
    }
  };
  onLongPress = () => {
    const { onLongPress } = this.props;
    if (onLongPress) {
      onLongPress();
    }
  };

  render() {
    const { name, date, info1, info2, isActive } = this.props;
    return (
      <TouchableOpacity onPress={this.onPress} onLongPress={this.onLongPress}>
        <View
          style={[
            styles.containerStyle,
            isActive
              ? { backgroundColor: Style.color.customGray, borderColor: Style.color.darkBorder }
              : {}
          ]}
        >
          <View style={styles.detailStyle}>
            <Text style={[Style.textEmphasize, { maxWidth: 148 }]}>{name}</Text>
            <Text style={Style.normalDarkText}>{date}</Text>
          </View>
          <View style={styles.detailStyle}>
            <Text style={Style.normalDarkText}>{info1}</Text>
            <Text style={Style.normalDarkText}>{info2}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: 64,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Style.color.lightBorder,
    justifyContent: 'center'
  },
  detailStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  }
});
