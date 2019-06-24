import React from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet, Text } from 'react-native';
import { Style } from '../../../components';
import { AlertInfo } from '../../../utils/Dialog';

class NumericInput extends React.Component {

  state = {
    value: '0',
    onFocus: false
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.value) {
    //   this.setState({
    //     value: `${nextProps.value}`
    //   });
    // }
  }

  onDecrease = () => {
    const { value } = this.state;
    // if (!value || isNaN(value)) return;
    const realValue = parseInt(value, 10);
    // if (realValue < 1) return;
    this.setState(
    { value: `${realValue - 1}` }
    );
    this.props.onChange(realValue - 1);
  }

  onIncrease = () => {
    const { value } = this.state;
    // if (!value || isNaN(value)) return;
    const realValue = parseInt(value, 10);
    // if (realValue >= this.props.maxValue) return;
    this.setState({ value: `${realValue + 1}` });
    this.props.onChange(realValue + 1);
  }
  onChange = (text) => {
    if (!this.state.onFocus) return;
    // if (isNaN(text) && text !== '0' && text !== '') return;
    if (text === '') {
      this.setState({
        value: '0'
      });
      return;
    }

    this.setState({
      value: `${parseInt(text, 10)}`
    });
  }

  onSubmit = () => {
    const { value } = this.state;

    if (!value || isNaN(value)) {
      AlertInfo('Vui lòng nhập thông tin chính xác');
      return;
    }

    const realValue = parseInt(value, 10);
    if (realValue <= 0) {
      AlertInfo('Vui lòng nhập thông tin chính xác');
      return;
    }
    if (realValue > this.props.maxValue) {
      AlertInfo(`Sản phẩm chỉ còn: ${this.props.maxValue} cái`);
      return;
    }

    this.props.onChange(realValue);
  }

  render() {
    return (
      <View style={[{ width: '80%', height: 36, flexDirection: 'row', alignSelf: 'center', marginBottom: 4 }, styles.borderStyle]}>
      <TouchableOpacity style={styles.buttonStyle} onPress={this.onDecrease}>
           <Text style={[Style.blackHeaderTitle, { color: Style.color.blackBlue }]} >-</Text>
         </TouchableOpacity>
        <TextInput
          style={[{ flex: 1, borderRightWidth: 1, borderLeftWidth: 1, borderColor: Style.color.blackBlue, textAlign: 'center' }, Style.normalDarkText]}
          value={this.state.value}
          keyboardType="numeric"
          onChangeText={text => this.onChange(text)}
          onSubmitEditing={this.onSubmit}
          onFocus={() => this.setState({ onFocus: true })}
          onBlur={() => this.setState({ onFocus: false })}
        />
          <TouchableOpacity style={styles.buttonStyle} onPress={this.onIncrease}>
          <Text style={[Style.blackHeaderTitle, { color: Style.color.blackBlue }]}>+</Text>
        </TouchableOpacity>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  borderStyle: {
    borderWidth: 1,
    borderColor: Style.color.blackBlue
  },
  buttonStyle: {
    width: '25%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default NumericInput;
