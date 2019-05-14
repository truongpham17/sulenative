import React from 'react';
import { iOSUIKit, iOSColors } from 'react-native-typography';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import RowTable from '../../../components/RowTable';
import { Product, ProductBill } from '../../../models';
import { SubmitButton } from '../../../components/button';
import { Style } from '../../../components';

type PropsType = {
  index: number,
  productBill: ProductBill,
  onChangeText: (text: string, product: Product) => null
};

class DetailItem extends React.Component<PropsType> {
  state = {
    isEditing: false
  };

  onConfirmEdit = () => {
    const { productBill, onChangeText } = this.props;
    onChangeText(productBill.product.quantity.toString(), productBill.product);
    this.setState({ isEditing: true });
  };

  renderTextInput = () => {
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

  render() {
    const { index, productBill } = this.props;
    const { isEditing } = this.state;
    const { product } = productBill;
    return (
      <RowTable
        containerStyle={
          isEditing && productBill.paybackQuantity > 0
            ? { backgroundColor: Style.color.lightGray }
            : {}
        }
      >
        <Text style={Style.normalDarkText}>{index}</Text>
        <Text style={Style.normalDarkText}>{product.total}</Text>
        <Text style={Style.normalDarkText}>{product.importPrice}</Text>
        <Text style={Style.normalDarkText}>{product.exportPrice}</Text>
        <Text style={Style.normalDarkText}>{product.total - product.quantity}</Text>
        <Text style={Style.normalDarkText}>{product.quantity}</Text>
        {this.renderTextInput()}
      </RowTable>
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
