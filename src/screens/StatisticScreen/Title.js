import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Style } from '../../components';
import { SwitchButton } from '../../components/button';

class Title extends React.PureComponent {
  state = {
    type: '' // "date" || "month"
  };
  onMonthPress = () => {
    const { onMonthPress } = this.props;
    this.setState({
      type: 'Month'
    });
    if (onMonthPress) {
      onMonthPress();
    }
  };

  onDatePress = () => {
    const { onDatePress } = this.props;
    this.setState({ type: 'Date' });
    if (onDatePress) {
      onDatePress();
    }
  };

  render() {
    const { containerStyle, start, end } = this.props;
    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.textStyle}>Thống kê doanh thu</Text>
          <Text style={styles.footerStyle}>
            Từ {start} đến {end}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.footerStyle}>Thống kê theo:</Text>
          <View style={styles.buttonContainerStyle}>
            <SwitchButton
              title="Ngày"
              onPress={this.onDatePress}
              active={this.state.type === 'Date'}
            />
            <SwitchButton
              title="Tháng"
              onPress={this.onMonthPress}
              active={this.state.type === 'Month'}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Title;

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonStyle: {
    height: 44,
    paddingLeft: 15,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Style.color.lightBlue,
    borderWidth: 1,
    width: 100
  },
  buttonContainerStyle: {
    width: 180,
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginStart: 40
  },
  textStyle: Style.blackHeaderTitle,
  footerStyle: {
    ...Style.normalDarkText,
    marginStart: 10
  }
});
