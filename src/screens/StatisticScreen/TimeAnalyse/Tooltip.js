import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Circle, G, Line, Rect, Text } from 'react-native-svg';
import { formatPrice } from '../../../utils/String';

class Tooltip extends React.PureComponent {
  render() {
    const { x, y, value, index } = this.props;
    const height = y(value) > 150 ? 100 : 160;
    const gHeight = y(value) > 150 ? 60 : 160;

    return (
      <G x={x(index) - 75 / 2} key={'tooltip'}>
        <G y={gHeight}>
          <Rect height={40} width={75} stroke={'grey'} fill={'white'} ry={10} rx={10} />
          <Text
            x={75 / 2}
            dy={20}
            alignmentBaseline={'middle'}
            textAnchor={'middle'}
            stroke={'rgb(134, 65, 244)'}
          >
            {formatPrice(value)}
          </Text>
        </G>
        <G x={75 / 2}>
          <Line y1={height} y2={y(value)} stroke={'grey'} strokeWidth={2} />
          <Circle cy={y(value)} r={6} stroke={'rgb(134, 65, 244)'} strokeWidth={2} fill={'white'} />
        </G>
      </G>
    );
  }
}

export default Tooltip;
