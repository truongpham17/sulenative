import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { iOSColors } from 'react-native-typography';
import { formatPrice } from '../../utils/String';
import { Style } from '../../components';

type PropsType = {
  quantity: number,
  importPrice: number,
  exportPrice: number,
  onNoteChange: (text: string) => void,
  onSubmit: () => void,
  note: string
};

class Info extends React.Component<PropsType> {
  onSubmit = () => {
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit();
    }
  };

  render() {
    const { quantity, importPrice, exportPrice } = this.props;
    return (
      <View style={styles.shadowStyle}>
        <View style={styles.containerStyle}>
          <View style={styles.itemStyle}>
            <View style={styles.itemStyle}>
              <Text style={Style.textEmphasize}>Tổng cộng </Text>
            </View>
            <View style={styles.itemStyle}>
              <Text style={Style.textEmphasize}>{quantity} cái</Text>
            </View>
            <View style={styles.itemStyle}>
              <Text style={Style.textEmphasize}>{formatPrice(importPrice)}</Text>
            </View>
            <View style={styles.itemStyle}>
              <Text style={Style.textEmphasize}>{formatPrice(exportPrice)}</Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shadowStyle: {
    width: '100%',
    height: 32
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  itemStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  textStyle: {
    fontSize: 24
  },
  buttonStyle: {
    borderRadius: 8,
    width: 180,
    height: 48,
    backgroundColor: Style.color.blackBlue
  },
  textInputStyle: {
    width: 240,
    height: 100,
    backgroundColor: iOSColors.customGray,
    paddingStart: 24
  }
});

export default Info;
