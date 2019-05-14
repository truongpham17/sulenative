import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import TabScreen from './TabScreen';
import { Product, StoreHistory } from '../../../models';
import { Style } from '../../../components';

type PropsType = {};

type StateType = {
  productList: Array<Product>,
  historyList: Array<StoreHistory>,
  productQuantity: number,
  currentProductIndex: number
};

class RightPanel extends React.Component<PropsType, StateType> {
  render() {
    return (
      <View style={styles.containerStyle}>
        <TabScreen />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 3
  },

  buttonGroupStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 12
  },
  buttonStyle: {
    borderRadius: 8,
    width: 140,
    height: 48,
    backgroundColor: Style.color.blackBlue
  }
});

export default connect(state => ({
  currentStore: state.store.stores
}))(RightPanel);
