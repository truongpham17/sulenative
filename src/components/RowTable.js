import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Style from './Style';

type PropsType = {
  children: Array<React.Node>,
  containerStyle: {},
  flexArray: Array<number>,
  itemContainerStyle: {},
  haveSeparate?: boolean
};
class RowTable extends React.Component<PropsType> {
  static defaultProps = {
    haveSeparate: true
  };
  render() {
    const { containerStyle, flexArray, itemContainerStyle, haveSeparate } = this.props;
    return (
      <View style={[{ width: '100%', height: 60 }, containerStyle]}>
        <View style={styles.containerStyle}>
          {this.props.children.map((item, index) => (
            <View
              style={[
                styles.itemContainerStyle,
                itemContainerStyle,
                flexArray ? { flex: flexArray[index] } : {}
              ]}
              key={index}
            >
              {item}
            </View>
          ))}
        </View>
        {haveSeparate ? (
          <View style={{ width: '100%', height: 0.5, backgroundColor: Style.color.customDark }} />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemContainerStyle: {
    flex: 1,
    alignItems: 'center'
    // justifyContent: 'center'
  }
});

export default RowTable;
