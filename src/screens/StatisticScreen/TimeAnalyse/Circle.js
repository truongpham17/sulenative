import React from 'react';
import { Circle } from 'react-native-svg';

class CircleIcon extends React.Component {
  render() {
    const { index, x, y, value, onPointPress } = this.props;
    return (
      <Circle
        onPress={() => {
          onPointPress(index);
        }}
        key={index}
        cx={x(index)}
        cy={y(value)}
        r={6}
        stroke={'rgb(134, 65, 244)'}
        fill={'white'}
      />
    );
  }
}

export default CircleIcon;
