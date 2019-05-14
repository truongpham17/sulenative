import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Arrow from './Arrow';
import Total from './Total';
import { Style } from '../../../components';

class Card extends React.PureComponent {
  render() {
    const { billCount, totalSoldMoney, navigation } = this.props;
    return (
      <View style={styles.containerStyle}>
        <TouchableOpacity
          style={[{ marginTop: 20 }]}
          onPress={() => navigation.navigate('SaleScreen')}
        >
          <Arrow width="90%" />
        </TouchableOpacity>
        <Total
          billCount={billCount}
          totalSoldMoney={totalSoldMoney}
          containerStyle={styles.cardTotal}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Style.color.white,
    paddingStart: 20,
    marginBottom: 10
  },
  cardTotal: {
    marginTop: 40,
    width: '100%',
    height: '30%'
  }
});

export default Card;
