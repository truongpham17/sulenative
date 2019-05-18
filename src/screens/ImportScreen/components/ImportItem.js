import React from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, AlertIOS, Keyboard } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { iOSUIKit, iOSColors } from 'react-native-typography';
import { Icon } from 'react-native-elements';
import RowTable from '../../../components/RowTable';
import { Product } from '../../../models';
import { SubmitButton, EditButton } from '../../../components/button';
import { formatPrice } from '../../../utils/String';
import { Style } from '../../../components';
import { Alert, AlertInfo } from '../../../utils/Dialog';

type PropsType = {
  index: number,
  isFocus: boolean,
  onSubmit: () => null,
  data: Product,
  onChange: () => null,
  onRemove: () => null
};

class ImportItem extends React.Component<PropsType> {
  state = {
    isEnable: this.props.isFocus,
    autoFocus: true
  };

  onEdit = () => {
    this.setState({ isEnable: true }, () => {
      this.thirdTextInput.focus();
    });
  };

  onPress = () => {
    const { onSubmit, data, isFocus, index } = this.props;
    if (!data.quantity || data.quantity === '0' || !data.importPrice || data.importPrice === '0') {
      this.setState({ autoFocus: false });
      AlertInfo('Vui lòng nhập thông tin chính xác', () => this.setState({ autoFocus: true }));
      setTimeout(() => {
        Keyboard.dismiss();
      }, 100);
      return;
    }

    this.setState({ isEnable: isFocus });

    if (onSubmit) {
      onSubmit(index === 0);
    }
  };

  onRemove = () => {
    const { onRemove, index, isFocus } = this.props;
    if (isFocus) return;
    if (onRemove) {
      onRemove(index);
    }
  };

  onChangeText = (value, type) => {
    const { onChange, index } = this.props;
    const { isEnable } = this.state;
    if (!isEnable) return;
    if (value.length === 0) {
      if (onChange) {
        onChange(index, '', type);
      }
      return;
    }
    if (!isNaN(value)) {
      const quantity = parseInt(value, 10);
      if (quantity >= 0) {
        if (onChange) {
          onChange(index, quantity, type);
        }
      }
    }
  };

  onFocus = () => {
    this.setState({
      isEnable: true
    });
  };

  renderRemoveButton() {
    return (
      <TouchableOpacity onPress={this.onRemove} style={styles.removeButtonStyle}>
        <Icon name="delete" type="antdesign" size={32} />
      </TouchableOpacity>
    );
  }

  render() {
    const { index, isFocus, data } = this.props;
    const { isEnable, autoFocus } = this.state;
    const btn = [
      {
        component: this.renderRemoveButton(),
        backgroundColor: 'transparent'
      }
    ];
    return (
      <Swipeout right={btn} backgroundColor={iOSColors.white}>
        <RowTable
          containerStyle={{
            backgroundColor: isEnable ? Style.color.white : Style.color.lightGray
          }}
        >
          {/* <Text style={Style.normalDarkText}>{index}</Text> */}
          <TextInput
            value={isEnable ? data.importPrice.toString() : formatPrice(data.importPrice)}
            style={styles.inputStyle}
            keyboardType="numeric"
            onChangeText={text => this.onChangeText(text, 'importPrice')}
            ref={input => {
              this.firstTextInput = input;
            }}
            onSubmitEditing={() => {
              this.secondTextInput.focus();
            }}
            // editable={isEnable}
            returnKeyType="next"
            onFocus={this.onFocus}
          />
          <TextInput
            value={isEnable ? data.exportPrice.toString() : formatPrice(data.exportPrice)}
            style={styles.inputStyle}
            keyboardType="numeric"
            onChangeText={text => this.onChangeText(text, 'exportPrice')}
            onSubmitEditing={() => {
              this.thirdTextInput.focus();
            }}
            ref={input => {
              this.secondTextInput = input;
            }}
            // editable={isEnable}
            returnKeyType="next"
            onFocus={this.onFocus}
          />

          <TextInput
            value={isEnable ? data.quantity.toString() : `${data.quantity} cái`}
            style={styles.inputStyle}
            keyboardType="numeric"
            onChangeText={text => this.onChangeText(text, 'quantity')}
            onSubmitEditing={() => {
              this.onPress();
              if (isFocus) {
                this.firstTextInput.focus();
              } else {
                this.setState({
                  isEnable: false
                });
              }
            }}
            ref={input => {
              this.thirdTextInput = input;
            }}
            // editable={isEnable}
            returnKeyType="next"
            onFocus={this.onFocus}
          />
          {/* 
          {isFocus || isEnable ? (
            <SubmitButton title="Xong" onPress={this.onPress} />
          ) : (
            <EditButton title="Sửa" onPress={() => this.onEdit()} />
          )} */}
        </RowTable>
      </Swipeout>
    );
  }
}
const styles = StyleSheet.create({
  inputStyle: {
    ...Style.normalDarkText,
    width: 80,
    height: 36,
    color: Style.color.black,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    textAlign: 'center'
  },
  removeButtonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTextStyle: {
    ...iOSUIKit.bodyEmphasized,
    fontSize: 14,
    color: iOSColors.white
  },
  buttonStyle: {
    width: 80,
    height: 40,
    padding: 0,
    borderColor: iOSColors.white
  }
});

export default ImportItem;
