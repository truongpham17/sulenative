/* eslint-disable camelcase */
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { Store } from '../../models';
import { AlertInfo } from '../../utils/Dialog';
import { Style } from '../../components';

const ROW_1 = [7, 8, 9];
const ROW_2 = [4, 5, 6];
const ROW_3 = [1, 2, 3];
const ROW_4 = ['null', 0, '.'];
const ROW_FUNCTION = ['delete', 'next', 'enter'];
const DATA = [ROW_1, ROW_2, ROW_3, ROW_4];

type PropsType = {
  currentStore: Store,
  haveImportPrice: Boolean,
  haveDiscount: boolean
}


const INITIAL_STATE = {
  value: {
    quantity: '',
    importPrice: '',
    exportPrice: '',
    discount: ''
  },
  type: 'quantity',
  renderImport: false,
  renderExport: false,
  renderDiscount: false
};

class Calculator extends React.Component<PropsType> {

  state = INITIAL_STATE;

  componentWillReceiveProps(props) {
    if (props.haveImportPrice !== this.props.haveImportPrice || props.haveDiscount !== this.props.haveDiscount) {
      this.setState(INITIAL_STATE);
    }
  }

  onSubmitItem = (result) => {
    if (result) {
      this.props.onSubmitItem(result);
      this.setState(INITIAL_STATE);
    } else {
      AlertInfo('Vui lòng nhập đúng thông tin');
    }
  }


  onItemPress = (item) => {
    const { value, type } = this.state;
    const { haveDiscount, haveImportPrice } = this.props;
    const valueIndex = value[type];

    const valueLength = valueIndex.length;
    const dotIndex = valueIndex.indexOf('.');

    if (item === 0 && valueLength === 0) {
      return;
    }
    if (!isNaN(item)) {
      this.setState({ value: { ...value, [type]: valueIndex.concat(item) } });
      return;
    }

    if (item === '.' && (type === 'quantity' || dotIndex >= 0 || valueLength === 0)) {
      return;
    }
    if (item === '.') {
      this.setState({ value: { ...value, [type]: valueIndex.concat(item) } });
      return;
    }

    if (item === 'delete') {
      if (valueLength > 1) {
        this.setState({ value: { ...value, [type]: valueIndex.substring(0, valueLength - 1) } });
      } else if (type === 'discount') {
        this.setState({
          type: 'exportPrice',
          renderDiscount: false,
          value: { ...value, [type]: '' }
        });
      } else if (type === 'exportPrice' && haveImportPrice) {
          this.setState({
            type: 'importPrice',
            renderExport: false,
            value: { ...value, [type]: '' }
          });
        } else {
          this.setState({
            type: 'quantity',
            renderExport: false,
            renderImport: false,
            value: { ...value, [type]: '' }
          });
        }
      return;
    }

    if (item === 'next') {
      if (valueLength === 0 || (haveDiscount && type === 'discount') || (!haveDiscount && type === 'exportPrice')) {
        return;
      }
      if (type === 'quantity' && haveImportPrice) {
        this.setState({
          type: 'importPrice',
          renderImport: true,
          renderExport: false
        });
        return;
      }
      if (type === 'quantity' || type === 'importPrice') {
        this.setState({
          type: 'exportPrice',
          renderExport: true
        });
        return;
      }
      if (type === 'exportPrice' && haveDiscount) {
        this.setState({
          type: 'discount',
          renderDiscount: true
        });
        return;
      }
    }
    if (item === 'enter') {
      if ((type !== 'exportPrice' && type !== 'discount') || valueLength === 0) {
        return;
      }
      const result = this.checkValidate(value);
      if (result) {
        this.onSubmitItem(result);
      }
      return;
    }
  }

  checkValidate = () => {
    const { value, renderExport, renderImport } = this.state;
    const { haveImportPrice, haveDiscount } = this.props;
    if (haveImportPrice && (!renderImport || !renderExport)) {
      return false;
    }
    if (!renderExport) {
      return false;
    }
    return {
      importPrice: haveImportPrice ? parseInt(value.importPrice, 10) : null,
      exportPrice: parseInt(value.exportPrice, 10),
      quantity: parseInt(value.quantity, 10),
      discount: haveDiscount && value.discount ? parseInt(value.discount, 10) : null
    };
  }

  renderTypeLabel = (type) => (
    <View style={{ height: '100%', justifyContent: 'center', marginStart: 16, marginEnd: 4 }}>
      <Text style={styles.textCalculator}>{type}</Text>
    </View>
  )

  renderValue = (value) => (
    <Text style={[Style.superBigTextEmphasize, { fontWeight: 'normal' }]}>{value}</Text>
  )

  renderTextCalculator = () => {
    const { value, renderImport, renderExport, renderDiscount } = this.state;
    return (
      <View style={styles.textCalculatorContainer}>
        {this.renderTypeLabel('số lượng')}
        {this.renderValue(value.quantity)}
        {renderImport && this.renderTypeLabel('giá nhập')}
        {this.renderValue(value.importPrice)}
        {renderExport && this.renderTypeLabel('giá bán')}
        {this.renderValue(value.exportPrice)}
        {renderDiscount && this.renderTypeLabel('giảm giá')}
        {this.renderValue(value.discount)}
      </View>
    )
;
}


  renderItem = ({ item }) => {
    let value = null;
    if (isNaN(item)) {
      switch (item) {
        case 'null': return <View style={styles.itemStyle} />;
        case 'delete':value = (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="x" size={24} color={Style.color.black} type="feather" />
        <Text style={[styles.textStyle, { marginTop: 12 }]}>Xoá</Text>
      </View>); break;
      case 'enter': value = (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="corner-down-left" size={28} color={Style.color.black} type="feather" />
        <Text style={[styles.textStyle, { marginTop: 12 }]}>ENTER</Text>
      </View>); break;
      case 'next': value = (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="arrow-right" size={24} color={Style.color.black} type="feather" />
      <Text style={[styles.textStyle, { marginTop: 12 }]}>Tiếp</Text>
    </View>); break;
      default: value = null;
      }
    }
    return (
      <TouchableOpacity style={[styles.itemStyle, { flex: item === 'enter' ? 2 : 1 }]} onPress={() => this.onItemPress(item)}>
      {value || <Text style={[{ textAlign: 'center' }, Style.bigTextEmphasize]}>{item}</Text>}
    </TouchableOpacity>
    );
  }

  renderRow = () => DATA.map(row => (<View style={{ flex: 1, flexDirection: 'row' }}>
        {row.map(item => this.renderItem({ item, flex: 1 }))}
    </View>)
    );

  renderFunction = () => ROW_FUNCTION.map(item => this.renderItem({ item }))

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderTextCalculator()}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 3 }}>
            {this.renderRow()}
          </View>
          <View style={{ flex: 1 }}>
            {this.renderFunction()}
          </View>
        </View>
      </View>

    );
  }
}

export default Calculator;


const styles = StyleSheet.create(
{
  itemStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 4,
    borderColor: Style.color.gray,
    shadowOffset: { x: 0, y: 2 },
    shadowColor: Style.color.gray,
    borderWidth: 1,
    backgroundColor: Style.color.white
  },
  textStyle: {
    alignItems: 'center',
    ...Style.bigTextEmphasize
  },
  textCalculatorContainer: {
    height: 48,
    backgroundColor: Style.color.white,
    marginHorizontal: 4,
    marginBottom: 6,
    borderRadius: 4,
    marginEnd: 8,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  textCalculator: {
    ...Style.normalLightText,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Style.color.blackBlue,
    paddingHorizontal: 4
  }
}
);
