import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  AlertIOS,
  TextInput,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { iOSUIKit, iOSColors } from 'react-native-typography';
import { ACTIVE_COLOR_DEFAULT } from '../../../assets/Color';
import { formatPrice } from '../../../utils/String';
import { ProductBill } from '../../../models';
import { SubmitButton, EditButton } from '../../../components/button';
import { Style } from '../../../components';
import { AlertInfo, Promt } from '../../../utils/Dialog';

type PropsType = {
  product: ProductBill,
  onQuantityChange: (value: number) => null,
  onSubmit: () => null,
  isSell: boolean,
  isSubmit: boolean,
  setDiscount: (id: string, value: string) => null
};

class PriceItem extends React.Component<PropsType> {
  state = {
    isFocus: false
  };
  onQuantityChange = (value, isSubmit) => {
    const { onQuantityChange, product, isSell } = this.props;
    if (isSell && product.paybackQuantity > 0) return;
    if (!isSell && product.soldQuantity > 0) return;
    if (product.product.quantity === 0 && isSell) return;
    if (onQuantityChange) {
      const quantity = value.length === 0 ? 0 : value;
      onQuantityChange(product, quantity, isSubmit);
    }
  };

  onTabItem = () => {
    const { product } = this.props;
    const quantity = product.paybackQuantity > 0 ? product.paybackQuantity : product.soldQuantity;
    this.onQuantityChange(quantity + 1, true);
  };

  onDiscount = value => {
    const { product, setDiscount } = this.props;
    if (isNaN(value)) {
      AlertInfo('Vui lòng nhập số!');
      return;
    }
    const discount = parseInt(value, 10);
    if (discount > product.product.exportPrice) {
      AlertInfo('Giá giảm phải thấp hơn giá bán!');
      return;
    }
    if (discount < 0) {
      AlertInfo('Không được giảm giá âm!');
      return;
    }
    if (setDiscount) {
      setDiscount(product.id, discount);
    }
  };

  onSubmit = () => {
    const { onSubmit, product, isSubmit, isSell } = this.props;
    if (isSubmit && product.paybackQuantity > 0) {
      return;
    }
    // if (product.product.quantity === 0 && !isSell) {
    //   return;
    // }
    if ((isSell && product.soldQuantity > 0) || (!isSell && product.paybackQuantity > 0)) {
      //submit item
      if (onSubmit) {
        onSubmit(product);
      }
      this.setState({
        isFocus: false
      });
      // Keyboard.dismiss();
    }
  };

  onDiscountPress = () => {
    Promt('Nhập số tiền giảm', null, 'Huỷ', 'Xong', this.onDiscount, null, '', 'numeric');
  };

  onFocus = () => {
    this.setState({
      isFocus: true
    });
  };

  onBlur = () => {
    this.setState({
      isFocus: false
    });
  };

  isValidate = () => {
    const { product, isSubmit, isSell } = this.props;
    return !isSubmit && (product.product.quantity > 0 || !isSell);
  };

  renderButton = () => {
    const { isSubmit, isSell, product } = this.props;

    if (isSubmit && !this.state.isFocus) {
      if (!isSell || product.paybackQuantity > 0) {
        return null;
      }
      return (
        <EditButton
          title="Giảm giá"
          buttonStyle={{ height: 36, padding: 0, marginLeft: 10 }}
          onPress={this.onDiscountPress}
        />
      );
    }
    return (
      <SubmitButton
        buttonStyle={{ marginLeft: 10 }}
        title="Xong"
        buttonStyle={{ height: 36, padding: 0, marginLeft: 10 }}
        onPress={this.onSubmit}
      />
    );
  };

  renderDetail = value => {
    const { product, isSell } = this.props;
    try {
      if (
        parseInt(product.product.quantity, 10) === 0 &&
        isSell &&
        parseInt(product.paybackQuantity, 10) === 0
      ) {
        return (
          <Text
            style={[
              Style.smallTextEmphasize,
              { color: ACTIVE_COLOR_DEFAULT, flex: 2, textAlign: 'right', paddingEnd: 12 }
            ]}
          >
            Hết hàng
          </Text>
        );
      }
    } catch (ex) {}

    return (
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          value={value}
          style={styles.textStyle}
          onChangeText={this.onQuantityChange}
          keyboardType="number-pad"
          textAlign="center"
          onSubmitEditing={() => {
            this.onSubmit();
          }}
          // editable={this.isValidate()}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {this.renderButton()}
      </View>
    );
  };

  render() {
    const { product, isSell, isSubmit } = this.props;
    let value = isSell ? product.soldQuantity.toString() : product.paybackQuantity.toString();
    let containerStyle;
    if (product.soldQuantity > 0 && isSubmit && !this.state.isFocus) {
      containerStyle = {
        backgroundColor: Style.color.customGray,
        borderColor: Style.color.darkBorder
      };
      value = `${product.soldQuantity} cái`;
    } else if (product.paybackQuantity > 0 && isSubmit && !this.state.isFocus) {
      containerStyle = { backgroundColor: iOSColors.gray };
      value = `${product.paybackQuantity} cái`;
    } else if (product.product.quantity === 0) {
      containerStyle = { backgroundColor: iOSColors.customGray };
    }
    return (
      <TouchableOpacity onPress={this.onTabItem} style={[styles.priceItem, containerStyle]}>
        <Text style={styles.priceStyle}>
          {`${formatPrice(product.product.exportPrice - product.discount)} ${
            product.product.isReturned ? '(HT)' : ''
          }`}
        </Text>
        {this.renderDetail(value)}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  priceItem: {
    width: '100%',
    height: 64,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Style.color.lightBorder
  },
  priceStyle: {
    ...Style.normalDarkText
  },
  textStyle: {
    ...Style.normalDarkText,
    width: 80,
    height: 36,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background
  }
});

export default PriceItem;
