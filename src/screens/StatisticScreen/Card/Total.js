import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatPrice } from '../../../utils/String';
import { Style } from '../../../components';

class Total extends React.PureComponent {
  renderItem(title, value) {
    return (
      <View>
        <Text style={styles.labelStyle}>{title}</Text>
        <Text style={styles.textStyle}>{value}</Text>
      </View>
    );
  }

  render() {
    const { containerStyle, billCount, totalSoldMoney } = this.props;
    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <View style={styles.verticalIndicatorStyle} />
        <View style={styles.contentStyle}>
          {this.renderItem('Tổng thu nhập', formatPrice(totalSoldMoney))}
          {this.renderItem('Tổng hoá đơn bán được', `${billCount} hoá đơn`)}
        </View>
      </View>
    );
  }
}

export default Total;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'row'
  },
  verticalIndicatorStyle: {
    width: 2,
    height: '100%',
    // margin: 12,
    backgroundColor: Style.color.lightBlue
  },
  contentStyle: {
    flex: 1,
    justifyContent: 'space-around',
    marginStart: 20
  },

  // note here

  labelStyle: {
    color: Style.color.darkGray,
    fontFamily: 'AvenirNext-Bold',
    fontSize: 14,
    fontWeight: '500'
  },
  titleStyle: {
    color: Style.color.black,
    fontFamily: 'AvenirNext-Bold',
    fontSize: 18,
    fontWeight: 'bold'
  },
  textStyle: {
    color: Style.color.black,
    fontFamily: 'AvenirNext-Bold',
    fontSize: 16
    // fontWeight: '400'
  }
});
