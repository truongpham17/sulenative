import React from 'react';
import { View, StyleSheet } from 'react-native';

import HistoryList from './HistoryList';
import CustomerDetail from './CustomerDetail';
import BillDetail from './BillDetail';
import { Style } from '../../../components';

class RightPanel extends React.Component {
  render() {
    const { containerStyle } = this.props;
    return (
      <View style={[{ flex: 1 }, containerStyle]}>
        <View style={styles.containerStyle}>
          <HistoryList />
          <View style={styles.detailContainerStyle}>
            <BillDetail />
            <CustomerDetail />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoContainerStyle: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonStyle: {
    borderRadius: 8,
    width: 140,
    height: 48,
    backgroundColor: Style.color.blackBlue
  },
  footerStyle: {
    height: 48,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4
  },
  containerStyle: {
    flex: 3,
    flexDirection: 'row'
  },
  detailContainerStyle: {
    flex: 2,
    justifyContent: 'flex-start'
  }
});

export default RightPanel;
