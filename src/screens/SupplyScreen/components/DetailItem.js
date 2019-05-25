import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { Product, ProductBill } from '../../../models';
import { Style } from '../../../components';
import { Promt, AlertInfo } from '../../../utils/Dialog';
import { formatPrice } from '../../../utils/String';

type PropsType = {
  index: number,
  productBill: ProductBill,
  onChangePaybackQuantity: (text: string, product: Product) => null
};

class DetailItem extends React.Component<PropsType> {
  state = {
    isEditing: false,
    isChangeExportPrice: false
  };

  onPaybackPress = () => {
    const { productBill } = this.props;
    Promt(
      'Nhập số lượng',
      null,
      'Huỷ',
      'Xong',
      value => this.onChangePaybackQuantity(value),
      null,
      productBill.product.quantity,
      'numeric'
    );
  };

  onChangePaybackQuantity = value => {
    const { productBill, onChangePaybackQuantity } = this.props;
    if (isNaN(value) || value.length === 0) {
      AlertInfo('Vui lòng nhập số lượng hợp lệ!');
    }
    const number = parseInt(value, 10);
    if (value < 0 || value > productBill.product.quantity) {
      AlertInfo('Vui lòng nhập số lượng hợp lệ!');
    }
    onChangePaybackQuantity(`${number}`, productBill.product);
  };

  onConfirmEdit = () => {
    const { productBill, onChangeText } = this.props;
    onChangeText(productBill.product.quantity.toString(), productBill.product);
    this.setState({ isEditing: true });
  };

  onConfirmChangeExportPrice = () => {
    this.setState({
      isChangeExportPrice: true
    });
  };

  onChangeExportPrice = value => {
    const { onChangeExportPrice, productBill } = this.props;
    if (isNaN(value) || value.length === 0) {
      AlertInfo('Vui lòng nhập số lượng hợp lệ!');
    }
    const number = parseInt(value, 10);
    if (value < 0) {
      AlertInfo('Vui lòng nhập số lượng hợp lệ!');
    }
    onChangeExportPrice(`${number}`, productBill.product);
  };

  onCardPress = () => {
    const { onCardPress, productBill } = this.props;
    onCardPress(productBill.id);
  };

  onEditExportPrice = () => {
    Promt(
      'Nhập giá bán',
      null,
      'Huỷ',
      'Xong',
      value => this.onChangeExportPrice(value),
      null,
      '',
      'numeric'
    );
  };

  renderPaybackQuantity = () => {
    const { productBill } = this.props;
    if (productBill.paybackQuantity > 0) {
      return (
        <View style={styles.paypackContainer}>
          <Text style={[Style.textEmphasize, { color: Style.color.red }]}>
            -{productBill.paybackQuantity}
          </Text>
        </View>
      );
    }
    return null;
  };

  renderBestSeller = () => {
    const { index, productBill } = this.props;
    if (index <= 3 && productBill.product.soldQuantity > 0) {
      return (
        <View style={{ position: 'absolute', right: 0, top: 0, width: 80, height: 80 }}>
          <Image source={Style.bestSeller} width={80} height={80} resizeMode="contain" />
        </View>
      );
    }
  };

  render() {
    const { productBill } = this.props;
    const { product } = productBill;
    return (
      <TouchableOpacity style={styles.containerStyle} onPress={this.onCardPress}>
        {this.renderBestSeller()}
        {this.renderPaybackQuantity()}
        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={Style.superBigTextEmphasize}>{formatPrice(product.exportPrice)}</Text>
          <Text style={Style.normalDarkText}>Giá nhập: {formatPrice(product.importPrice)}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[styles.buttonStyle, { marginEnd: 2 }]}
            onPress={this.onPaybackPress}
          >
            <Icon
              type="feather"
              name="upload"
              size={12}
              color="white"
              containerStyle={{ marginEnd: 2 }}
            />
            <Text style={[Style.normalLightText, { fontSize: 14 }]}>Trả hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonStyle, { marginStart: 2 }]}
            onPress={this.onEditExportPrice}
          >
            <Icon
              type="feather"
              name="dollar-sign"
              size={12}
              color="white"
              containerStyle={{ marginEnd: 2 }}
            />
            <Text style={[Style.normalLightText, { fontSize: 14 }]}> Sửa giá </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

export default DetailItem;

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
    height: 140,
    backgroundColor: Style.color.background,
    margin: 2
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
