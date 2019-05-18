import React from 'react';
import { View, Text, TextInput, StyleSheet, AlertIOS } from 'react-native';
import Swipeout from 'react-native-swipeout';
import RowTable from '../../../components/RowTable';
import { Product, ProductBill } from '../../../models';
import { SubmitButton } from '../../../components/button';
import { Style } from '../../../components';
import { Promt } from '../../../utils/Dialog';

type PropsType = {
  index: number,
  productBill: ProductBill,
  onChangeText: (text: string, product: Product) => null
};

class DetailItem extends React.Component<PropsType> {
  state = {
    isEditing: false,
    isChangeExportPrice: false
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

  onEditExportPrice = () => {
    const { onChangeExportPrice, productBill } = this.props;
    Promt(
      'Nhập giá bán',
      null,
      'Huỷ',
      'Xong',
      value => onChangeExportPrice(value, productBill.product),
      null,
      '',
      'numeric'
    );
  };

  renderPaybackButton = () => {
    const { productBill, onChangeText } = this.props;
    const { isEditing } = this.state;
    if (productBill.product.quantity === 0) {
      return <View />;
    }
    if (!isEditing) {
      return <SubmitButton title="Chọn" onPress={this.onConfirmEdit} />;
    }
    return (
      <TextInput
        style={[styles.inputStyle]}
        keyboardType="numeric"
        onChangeText={text => onChangeText(text, productBill.product)}
        value={productBill.paybackQuantity.toString()}
        autoFocus
      />
    );
  };

  renderEditButton = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SubmitButton
        title="Sửa giá"
        onPress={this.onEditExportPrice}
        buttonStyle={{ backgroundColor: Style.color.blackBlue }}
      />
    </View>
  );

  render() {
    const { productBill } = this.props;
    const { product } = productBill;
    const btn = [
      {
        component: this.renderEditButton(),
        backgroundColor: 'transparent'
      }
    ];
    return (
      <Swipeout right={btn} backgroundColor={Style.color.lightGray}>
        <RowTable containerStyle={{ backgroundColor: Style.color.white }}>
          <Text style={Style.normalDarkText}>{product.total}</Text>
          <Text style={Style.normalDarkText}>{product.importPrice}</Text>
          <Text style={Style.normalDarkText}>{product.exportPrice}</Text>
          <Text style={Style.normalDarkText}>{product.total - product.quantity}</Text>
          <Text style={Style.normalDarkText}>{product.quantity}</Text>
        </RowTable>
      </Swipeout>
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
  }
});
