import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Style from './Style';

const Title = props => (
  <View style={[styles.containerStyle, props.containerStyle]}>
    {props.data.map(value => (
      <View style={styles.itemContainerStyle} key={value}>
        <Text style={Style.blackTitle}>{value}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Style.color.background,
    zIndex: 2
  },
  itemContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Title;
