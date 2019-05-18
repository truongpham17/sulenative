import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { iOSColors } from 'react-native-typography';
import { Style } from '../../../components';
import { formatPrice } from '../../../utils/String';

class BasicInfo extends React.Component {
  render() {
    const { billDetail, currentBill } = this.props;
    console.log(currentBill);
    const data = currentBill.customer || {};
    let text = '';
    let textStyle = {};
    if (billDetail.totalPrice - billDetail.totalPaid === 0) {
      text = 'Đã thanh toán';
      textStyle = styles.specificText;
    } else {
      text = 'Còn thiếu';
      textStyle = styles.specificTextError;
    }
    return (
      <View style={styles.containerStyle}>
        <View style={styles.nameContainer}>
          <View>
            <Text style={[Style.blackEmphasizeTitle]}>{data.name || 'Alexander'}</Text>
            <Text style={Style.smallPlaceholderText}>{data.phone || '0123456789'}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={Style.smallPlaceholderText}>Sold by: </Text>
            <Text style={(Style.textEmphasize, { marginBottom: 1 })}>Truong Pham</Text>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}
          >
            <Text style={[Style.superBigTextEmphasize, { textAlign: 'right' }]}>
              {formatPrice(billDetail.totalPrice)}.00{'    '}
            </Text>
          </View>
          <View style={styles.numericContainer}>
            <Text style={Style.smallPlaceholderText}>Order: {currentBill.id}</Text>
            <View>
              <Text style={textStyle}>{text}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(state => ({
  currentBill: state.sellHistory.currentBill,
  // info: state.sellHistory.currentBill.customer,
  billDetail: state.sellHistory.currentBill
  // id: state.sellHistory.currentBill.id
}))(BasicInfo);

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameContainer: {
    width: '40%',
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  numericContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  specificText: {
    backgroundColor: '#F0FBF1',
    color: iOSColors.green,
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    fontSize: 14,
    paddingHorizontal: 2
  },
  specificTextError: {
    backgroundColor: '#FCEFED',
    color: iOSColors.red,
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    fontSize: 14,
    paddingHorizontal: 4
  }
});
