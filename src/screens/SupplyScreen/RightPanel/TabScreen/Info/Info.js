import React from 'react';
import { View, Text as TextNative, StyleSheet } from 'react-native';
import { BarChart, PieChart } from 'react-native-svg-charts';
import { connect } from 'react-redux';
import ChartLabels from './ChartLabel';
import { formatPrice } from '../../../../../utils/String';
import { Style } from '../../../../../components';
import EmptyScreen from '../../../../../components/EmptyStatus';
import { SubmitButton } from '../../../../../components/button';

const colors = ['#5c6bc0', '#3f51b5', '#3949ab'];

class Info extends React.PureComponent {
  state = {
    storeSelect: -1
  };

  getLabel = (index, value) => {
    let label;
    switch (index) {
      case 0:
        label = 'Tổng vốn';
        break;
      case 1:
        label = 'Tiền bán';
        break;
      case 2:
        label = 'Lợi nhuận';
        break;
      case 3:
        label = 'Tiền nợ';
        break;
      default:
        label = '';
    }
    return `${label}: ${formatPrice(value)}`;
  };

  getPieLabel = (index, value) => {
    let label;
    if (value === 0) return '.';
    switch (index) {
      case 0:
        label = 'Đã bán';
        break;
      case 1:
        label = 'Đã trả';
        break;
      case 2:
        label = 'Còn lại';
        break;
      default:
        label = '';
    }
    return `${label}: ${value}`;
  };

  getPieData = data => {
    console.log(data);
    const { storeSelect } = this.state;
    return data.map((value, index) => ({
      value,
      svg: {
        fill: colors[index]
        // onPress: () => console.log('press', index)
      },
      key: `pie-${index}`,
      label: this.getPieLabel(index, value),
      arc: {
        outerRadius: storeSelect === index ? '100%' : '90%',
        padAngle: storeSelect === index ? 0.05 : 0
      },
      onPress: () => this.setState({ storeSelect: index })
    }));
  };

  renderBrief = (color, data) => (
    <View style={{ width: 150, height: 25, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 14, height: 14, backgroundColor: color, marginEnd: 12 }} />
      <TextNative style={Style.normalDarkText}>{data}</TextNative>
    </View>
  );

  render() {
    const { store } = this.props;
    const data = [store.totalFund, store.totalSoldMoney, store.totalLoiNhuan, store.debt];
    const pieData = [store.totalSoldProduct, store.productQuantity];
    if (!store || !store.id || store.id.length === 0) {
      return <EmptyScreen label="Vui lòng chọn nguồn hàng" />;
    }
    if (!store.totalFund || store.totalFund === 0) {
      return <EmptyScreen label="Nguồn hàng này chưa có sản phẩm" />;
    }
    return (
      <View style={{ flex: 1, padding: 8 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', flex: 3 }}>
            <BarChart
              style={{ flex: 1 }}
              data={data}
              svg={{ fill: Style.color.lightBlue }}
              contentInset={{ top: 40, bottom: 10 }}
              spacing={0.2}
              gridMin={0}
            >
              <ChartLabels getLabel={this.getLabel} />
            </BarChart>
          </View>
          <View style={{ flex: 2 }}>
            <PieChart style={{ flex: 1 }} data={this.getPieData(pieData)} innerRadius={50} />
            <TextNative style={styles.totalTextStyle}>Tổng: {store.totalImportProduct}</TextNative>
            <View style={styles.briefContainerStyle}>
              {this.renderBrief(colors[0], `Đã bán: ${pieData[0]} cái`)}
              {this.renderBrief(colors[1], `Còn lại: ${pieData[1]} cái`)}
            </View>
          </View>
        </View>
        <SubmitButton title="Trả nợ nguồn hàng" buttonStyle={{ width: 150, alignSelf: 'center' }} />

        {/* <TextNative style={{ ...Style.textEmphasize, width: '100%', textAlign: 'center' }}>
          Nguồn hàng: {store.name}
        </TextNative> */}
        {/* <EmptyScreen /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  totalTextStyle: {
    position: 'absolute',
    left: 0,
    top: '48%',
    right: 0,
    textAlign: 'center',
    ...Style.textEmphasize
  },
  briefContainerStyle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 150,
    height: 80
  }
});

export default connect(state => ({
  store: state.detail.store
}))(Info);
