import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { Icon } from 'react-native-elements';
import { formatPrice } from '../utils/String';
import { Style } from '.';

type PropsType = {
  data: {store: {storeId: string, storeName: string}, quantity: Number, exportPrice: Number, isSell: Boolean},
  containerStyle: {},
  textStyle: {},
  index: Number,
  haveSource?: boolean,
  haveImportPrice? :Boolean
};

class DetailItem extends React.PureComponent<PropsType> {
  static defaultProps = {
    haveSource: true,
    haveImportPrice: false

  }
  renderTextItem() {
    const { data, haveSource, haveImportPrice } = this.props; // object: {store: {storeId, storeName}, quantity, exportPrice, isSell, discount};
    const sum = haveImportPrice ? data.importPrice * data.quantity : (data.exportPrice - (data.discount || 0)) * data.quantity;
    return (
      <View style={[styles.containerStyle, data.isSell ? styles.returnStyle : {}]}>
        {haveSource && (
        <View style={{ flexDirection: 'row', flex: 2, alignItems: 'center' }}>
          <Icon
            type="feather"
            name={data.isSell ? 'upload' : 'download'}
            size={18}
            color="white"
          />
          <Text style={[styles.textBigStyle]}>{data.store.storeName}</Text>
        </View>)}
        <Text style={[styles.textStyle]}>{data.quantity} cái</Text>
        {haveImportPrice && <Text style={styles.textStyle}>{formatPrice(data.importPrice)}</Text>}
        <Text style={[styles.textStyle]}>
          {formatPrice(data.exportPrice)}
          {data.discount > 0 && haveSource && <Text style={Style.noteText}>{' '}(-{data.discount})</Text> }
        </Text>
        <Text style={[styles.textStyle]}>{formatPrice(sum)}</Text>
      </View>
    );
  }

  renderRemoveButton() {
    const { index } = this.props;
    return (
      <TouchableOpacity style={styles.buttonStyle} onPress={() => this.props.onRemove(index)}>
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
    marginVertical: 5,
    backgroundColor: Style.color.gray
  },
  returnStyle: {
    backgroundColor: Style.color.lightBlue,
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
