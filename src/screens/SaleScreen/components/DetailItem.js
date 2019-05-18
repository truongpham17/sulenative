import React from 'react';
import { iOSColors } from 'react-native-typography';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { Icon } from 'react-native-elements';
import { ProductBill } from '../../../models';
import { formatPrice } from '../../../utils/String';
import { Style } from '../../../components';

type PropsType = {
  data: ProductBill,
  containerStyle: {},
  textStyle: {}
};

class DetailItem extends React.PureComponent<PropsType> {
  renderTextItem() {
    const { data } = this.props;
    let quantity;
    let style;
    let sum;
    // const price = data.product.exportPrice - data.discount;
    const price = data.product.exportPrice;
    if (data.soldQuantity > 0) {
      quantity = data.soldQuantity;
      style = { backgroundColor: Style.color.blackBlue };
      sum = quantity * (data.product.exportPrice - data.discount);
    } else {
      quantity = data.paybackQuantity;
      style = { backgroundColor: iOSColors.gray };
      sum = -quantity * data.product.exportPrice;
    }
    return (
      <View style={[styles.containerStyle, style]}>
        <View style={{ flexDirection: 'row', flex: 2, alignItems: 'center' }}>
          <Icon
            type="feather"
            name={data.soldQuantity > 0 ? 'upload' : 'download'}
            size={18}
            color="white"
          />
          <Text style={[styles.textBigStyle]}>{data.product.store.name}</Text>
        </View>
        <Text style={[styles.textStyle]}>
          {formatPrice(price)}
          {data.discount > 0 ? <Text style={Style.noteText}>(-{data.discount})</Text> : ''}
        </Text>
        <Text style={[styles.textStyle]}>{quantity}</Text>
        <Text style={[styles.textStyle]}>{formatPrice(sum)}</Text>
      </View>
    );
  }

  renderRemoveButton() {
    const { data } = this.props;
    return (
      <TouchableOpacity style={styles.buttonStyle} onPress={() => this.props.onRemove(data.id)}>
        <Icon name="delete" type="antdesign" size={24} />
      </TouchableOpacity>
    );
  }

  render() {
    const btn = [
      {
        component: this.renderRemoveButton(),
        backgroundColor: 'transparent'
      }
    ];
    return (
      <Swipeout right={btn} backgroundColor={Style.color.white}>
        {this.renderTextItem()}
      </Swipeout>
    );
  }
}

export default DetailItem;

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: 54,
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 5
  },
  buttonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    flex: 1,
    ...Style.normalLightText,
    textAlign: 'center',
    fontSize: 14
  },
  textBigStyle: {
    flex: 1,
    ...Style.normalLightText,
    textAlign: 'left',
    fontSize: 14,
    marginLeft: 5,
    textAlignVertical: 'bottom',
    paddingTop: 5
  }
});
