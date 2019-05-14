import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { RowTable } from '.';
import Style from './Style';

const Footer = props => (
  <RowTable containerStyle={styles.footerStyle} haveSeparate={false}>
    {props.data.map(item => (
      <Text style={Style.blackTitle} key={item}>
        {item}
      </Text>
    ))}
  </RowTable>
);

export default Footer;

const styles = StyleSheet.create({
  footerStyle: {
    backgroundColor: Style.color.darkBackground,
    height: 48
  }
});
