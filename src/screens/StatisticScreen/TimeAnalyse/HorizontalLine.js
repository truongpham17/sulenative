import React from 'react';
import { Line } from 'react-native-svg';

class HorizontalLine extends React.PureComponent {
  render() {
    const { y, value } = this.props;
    return (
      <Line
        key={'zero-axis'}
        x1={'0%'}
        x2={'100%'}
        y1={y(value)}
        y2={y(value)}
        stroke={'grey'}
        strokeDasharray={[4, 8]}
        strokeWidth={2}
      />
    );
  }
}

export default HorizontalLine;
