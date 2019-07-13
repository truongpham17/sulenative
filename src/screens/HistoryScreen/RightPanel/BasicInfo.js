import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { iOSColors } from 'react-native-typography';
import { Style } from '../../../components';
import { formatPrice } from '../../../utils/String';

class BasicInfo extends React.Component {
  render() {
    const { billDetail, currentBill } = this.props;
    const data = currentBill.customer || {};
    const text = 'Đã thanh toán';
    const textStyle = styles.specificText;
    // let textStyle = {};
    // if (billDetail.paymentStatus === 'paid') {
    //   text = 'Đã thanh toán';
    //   textStyle = styles.specificText;
    // } else {
    //   text = 'Mua thiếu';
    //   textStyle = styles.specificTextError;
    // }
    return (
      <View style={styles.containerStyle}>
        <View style={styles.nameContainer}>
          <View>
            <Text style={[Style.blackEmphasizeTitle, { fontSize: 20 }]}>
              {data.username || 'Không có tên'}
            </Text>
            <Text style={[Style.smallPlaceholderText]}>{data.phone || 'Không có số'}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={Style.smallPlaceholderText}>Nhân viên: </Text>
            <Text style={(Style.textEmphasize, { marginBottom: 1 })}>
              {billDetail.createdBy.fullname}
            </Text>
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
              {formatPrice(billDetail.totalPrice)}
            </Text>
          </View>
          <View style={styles.numericContainer}>
            <Text style={textStyle}>{text}</Text>

            <Text style={[Style.smallPlaceholderText, { textAlign: 'center' }]}>
              Mã hoá đơn: {currentBill.id}
            </Text>
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
    paddingVertical: 4
  },
  numericContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  specificText: {
    backgroundColor: '#F0FBF1',
    color: iOSColors.green,
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    fontSize: 14,
    paddingHorizontal: 2,
    textAlign: 'center'
  },
  specificTextError: {
    backgroundColor: '#FCEFED',
    color: iOSColors.red,
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    fontSize: 14,
    paddingHorizontal: 4,
    textAlign: 'center'
  }
});
