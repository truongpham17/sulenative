import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { SegmentedControls } from 'react-native-radio-buttons';
import TitleItem from './TitleItem';
import { formatPrice } from '../../../utils/String';
import { Style } from '../../../components';

const colors = [
  '#EB2332',
  '#CE3782',
  '#B960CA',
  '#32D7D0',
  '#A4D8FB',
  '#66D4B0',
  '#3C4D34',
  '#FD3C4F',
  '#EF7B30'
];

class StoreAnalyse extends React.Component {
  onItemPress = id => {
    this.props.onChange(id);
  };

  onSelection = type => {
    const { onSelection } = this.props;
    if (onSelection) {
      onSelection(type);
    }
  };

  getLeftValue = item => {
    try {
      const value =
        parseInt(item.store.totalImportProduct, 10) - parseInt(item.store.productQuantity, 10);
      if (isNaN(value)) {
        return 0;
      }
      return value;
    } catch (er) {
      return 0;
    }
  };

  getTitleValue = item => {
    const { selectedOption } = this.props;
    let value = '';
    switch (selectedOption) {
      case 'Lợi nhuận':
        value = `${item.store.name} - ${formatPrice(item.total)}`;
        break;
      case 'Còn lại':
        value = `${item.store.name} - ${item.store.productQuantity} cái`;
        break;
      case 'Đã bán':
        value = `${item.store.name} - ${this.getLeftValue(item)} cái`;
        break;
      default:
        value = '';
    }
    return value;
  };

  getData = () => {
    const { stores, storeSelectedId, selectedOption } = this.props;
    const keys = [];
    const data = [];

    stores.forEach((item, index) => {
      const percentage = 100;
      let value = 0;
      switch (selectedOption) {
        case 'Lợi nhuận':
          value = item.total;
          break;
        case 'Còn lại':
          value = item.store.productQuantity;
          break;
        case 'Đã bán':
          value = this.getLeftValue(item);
          break;
        default:
          value = 0;
      }
      keys.push(item.id);
      data.push({
        key: item.store._id,
        value: value >= 0 ? value : 0,
        svg: { fill: colors[index % colors.length] },
        arc: {
          outerRadius:
            storeSelectedId === item.store._id ? `${percentage + 10}%` : `${percentage}%`,
          padAngle: storeSelectedId === item.store._id ? 0.1 : 0
        },
        onPress: () => this.props.onChange(item.store._id)
      });
    });
    return data;
  };

  renderItem = () => {
    const { stores } = this.props;
    return (
      <FlatList
        renderItem={({ item, index }) => (
          <TitleItem
            color={colors[index % colors.length]}
            data={this.getTitleValue(item)}
            key={item.store._id}
            onPress={() => this.onItemPress(item.store._id)}
          />
        )}
        data={stores}
        extraData={this.props.selectedOption}
      />
    );
    // return stores.map((item, index) => (
  };

  render() {
    const { containerStyle, selectedOption } = this.props;
    return (
      <View style={[{ flex: 1 }, containerStyle]}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <Text style={Style.textEmphasize}>Theo nguồn hàng</Text>
          <View style={{ width: '40%', marginStart: '30%' }}>
            <SegmentedControls
              options={['Lợi nhuận', 'Đã bán', 'Còn lại']}
              onSelection={option => this.onSelection(option)}
              selectedOption={selectedOption}
            />
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, alignSelf: 'center' }}>{this.renderItem()}</View>
          <View style={{ flex: 1 }}>
            <PieChart
              style={{ flex: 1 }}
              outerRadius={'80%'}
              innerRadius={'30%'}
              data={this.getData()}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default StoreAnalyse;
