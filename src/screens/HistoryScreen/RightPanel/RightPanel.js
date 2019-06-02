import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';

import { Style, Line } from '../../../components';
import BasicInfo from './BasicInfo';
import ListProduct from './ListProduct';
import DetailList from './DetailList';
import EmptyScreen from '../../../components/EmptyStatus';

class RightPanel extends React.Component {
  render() {
    const { containerStyle, billDetail, onPayDebt, navigation } = this.props;
    return (
      <View style={[containerStyle]}>
        {billDetail.id ? (
          <View style={styles.containerStyle}>
            <View style={{ width: '100%', height: 96, marginVertical: 20 }}>
              <BasicInfo />
            </View>
            <Text style={Style.smallTextEmphasize}>Sản phẩm</Text>
            <Line color={Style.color.lightBorder} />
            {/* <View style={{ flex: 2, maxHeight: '%', marginBottom: 10 }}> */}
              <ListProduct />
            {/* </View> */}
            <Text style={Style.smallTextEmphasize}>Thông tin</Text>

            <Line color={Style.color.lightBorder} />
            {/* <View style={{ flex: 2 }}> */}
              <DetailList onPayDebt={onPayDebt} navigation={navigation} />
            {/* </View> */}
          </View>
        ) : (
          <EmptyScreen label="Vui lòng chọn hoá đơn" />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingHorizontal: 90,
    backgroundColor: Style.color.white,
    paddingVertical: 10
  }
});

export default connect(state => ({
  billDetail: state.sellHistory.currentBill
}))(RightPanel);
