import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import { Product, ProductBill } from '../../../models';
import { Style } from '../../../components';
import { formatPrice } from '../../../utils/String';
import { SubmitButton } from '../../../components/button';
import { AlertInfo, Promt } from '../../../utils/Dialog';

type PropsType = {
  index: number,
  productBill: ProductBill,
  onChangePaybackQuantity: (text: string, product: Product) => null
};

class PriceItemNew extends React.Component<PropsType> {
  onCardPress = () => {
    const { onCardPress, productBill } = this.props;
    onCardPress(productBill);
  };

  onDiscount = value => {
    const { productBill, setDiscount } = this.props;
    if (isNaN(value)) {
      AlertInfo('Vui lòng nhập số!');
      return;
    }
    const discount = parseInt(value, 10);
    if (discount > productBill.product.exportPrice) {
      AlertInfo('Giá giảm phải thấp hơn giá bán!');
      return;
    }
    if (discount < 0) {
      AlertInfo('Không được giảm giá âm!');
      return;
    }
    if (setDiscount) {
      setDiscount(productBill.id, discount);
    }
  };

  onDiscountPress = () => {
    const { productBill } = this.props;
    if (productBill.soldQuantity === 0) return;
    Promt('Nhập số tiền giảm', null, 'Huỷ', 'Xong', this.onDiscount, null, '', 'numeric');
  };

  render() {
    const { productBill, isSell, onQuantityChange } = this.props;
    const { product } = productBill;

    let style = {};
    const value = isSell ? productBill.soldQuantity : productBill.paybackQuantity;
    let color = 'white';
    if (isSell && productBill.soldQuantity > 0) {
      style = { backgroundColor: Style.color.lightPink };
      color = Style.color.lightPink;
    } else if (!isSell && productBill.paybackQuantity > 0) {
      style = { backgroundColor: Style.color.gray };
      color = Style.color.gray;
    }

    return (
      <TouchableOpacity style={[styles.containerStyle, style]} onPress={this.onCardPress}>
        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={Style.superBigTextEmphasize}>{formatPrice(product.exportPrice)}</Text>
            {productBill.product.isReturned ? <Text>Hàng trả</Text> : null}
          </View>
          <Text style={Style.normalDarkText}>Giá nhập: {formatPrice(product.importPrice)}</Text>
        </View>
        <NumericInput
          onChange={value => {
            console.log(value);
            onQuantityChange(productBill, value, true);
          }}
          totalHeight={30}
          step={1}
          initValue={value}
          value={value}
          minValue={0}
          maxValue={product.quantity}
          containerStyle={{ marginVertical: 3, width: '100%' }}
          leftButtonBackgroundColor={color}
          rightButtonBackgroundColor={color}
        />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <SubmitButton
            title="Giảm giá"
            buttonStyle={{ width: '100%', borderRadius: 0 }}
            onPress={this.onDiscountPress}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default PriceItemNew;

const styles = StyleSheet.create({
  inputStyle: {
    ...Style.normalDarkText,
    width: 80,
    height: 36,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    textAlign: 'center'
  },
  containerStyle: {
    flex: 1,
    height: 170,
    backgroundColor: Style.color.background,
    marginHorizontal: 2,
    marginBottom: 10
  },
  buttonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7986cb',
    flexDirection: 'row'
  },
  paypackContainer: {
    position: 'absolute',
    left: 4,
    top: 4,
    zIndex: 2
  }
});
