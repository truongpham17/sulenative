import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Style from '../Style';

type PropsType = {
  itemKey: string,
  icon: {},
  title: string,
  onPress: () => null,
  activeItemKey: string
};

class Item extends React.Component<PropsType> {
  render() {
    const { itemKey, icon, title, onPress, activeItem } = this.props;
    const isActive = itemKey === activeItem;
    return (
      <TouchableOpacity onPress={() => onPress(itemKey)}>
        <View
          style={[styles.itemStyle, isActive ? { backgroundColor: Style.color.blackBlue } : {}]}
        >
          <Icon {...icon} containerStyle={styles.iconStyle} color={Style.color.white} />
          <Text
            style={[
              Style.blackHeaderTitle,
              { color: Style.color.white },
              { fontSize: 18, marginTop: 4 }
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Item;

const styles = StyleSheet.create({
  itemStyle: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#40444f'
  },
  iconStyle: {
    width: 40,
    height: 48,
    marginEnd: 12,
    marginStart: 10,
    justifyContent: 'center'
  }
});
