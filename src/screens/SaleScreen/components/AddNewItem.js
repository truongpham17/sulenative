import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Style } from '../../../components';
import { SubmitButton } from '../../../components/button';
import { AlertInfo } from '../../../utils/Dialog';

class AddNewItem extends React.PureComponent {
  state = {
    quantity: '',
    importPrice: '',
    exportPrice: ''
  }

  onSubmit = () => {
    const { quantity, importPrice, exportPrice } = this.state;
    if (!quantity || isNaN(quantity) || !importPrice || isNaN(importPrice) || !exportPrice || isNaN(exportPrice)) {
      AlertInfo('Vui lòng nhập thông tin chính xác!');
      return;
    }
    const numQuantity = parseInt(quantity, 10);
    const numImportPrice = parseInt(importPrice, 10);
    const numExportPrice = parseInt(exportPrice, 10);
    if (numQuantity <= 0 || numExportPrice < 0 || numExportPrice < 0) {
      AlertInfo('Vui lòng nhập thông tin chính xác!');
      return;
    }
    this.props.callBack({
      quantity: numQuantity,
      importPrice: numImportPrice,
      exportPrice: numExportPrice
    }); this.setState({ quantity: '', importPrice: '', exportPrice: '' });
  }
  render() {
    return (
      <View style={styles.editContainerStyle}>
      <Text style={[Style.bigTextEmphasize, { textAlign: 'center' }]}>Nhập sản phẩm</Text>
      <View style={styles.itemStyle}>
        <Text style={[Style.normalDarkText, { paddingTop: 2 }]}>Số lượng: </Text>
        <TextInput
          style={styles.textInputStyle}
          value={this.state.quantity}
          autoFocus
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => this.second.focus()}
          onChangeText={text => this.setState({ quantity: text })}
        />
      </View>

      <View style={styles.itemStyle}>
        <Text style={Style.normalDarkText}>Giá nhập: </Text>
        <TextInput
          style={styles.textInputStyle}
          value={this.state.importPrice}
          keyboardType="numeric"
          ref={ref => this.second = ref}
          onSubmitEditing={() => this.third.focus()}
          returnKeyType="next"
          onChangeText={text => this.setState({ importPrice: text })}
        />
      </View>
      <View style={styles.itemStyle}>
        <Text style={Style.normalDarkText}>Giá bán: </Text>
        <TextInput
          style={styles.textInputStyle}
          ref={ref => this.third = ref}
          returnKeyType="next"
          keyboardType="numeric"
          onSubmitEditing={() => this.onSubmit()}
          value={this.state.exportPrice}
          onChangeText={text => this.setState({ exportPrice: text })}
        />
      </View>
      <SubmitButton
        buttonStyle={{ width: '96%', alignSelf: 'center' }}
        title="Xong"
        onPress={() => this.onSubmit()}
      />
    </View>
    );
  }
}

export default AddNewItem;


const styles = StyleSheet.create({
  textInputStyle: {
    paddingStart: 4,
    ...Style.textEmphasize,
    width: 120,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    paddingEnd: 4,
    paddingVertical: 2,
    marginEnd: -4
  },
  itemStyle: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center'
  },
  editContainerStyle: {
    marginTop: -300,
    width: '40%',
    height: '40%',
    alignSelf: 'center',
    backgroundColor: Style.color.white,
    justifyContent: 'space-around',
    padding: 10
  },
  containerStyle: {
    padding: 10,
    backgroundColor: Style.color.white,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 26,
    height: 160,
    justifyContent: 'space-around'
  }
});
