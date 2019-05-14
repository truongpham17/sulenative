import React from 'react';
import { Text } from 'react-native-svg';

const ChartLabel = ({ x, y, bandwidth, data, getLabel }) =>
  data.map((value, index) => (
    <Text
      key={index}
      x={x(index) + bandwidth / 2}
      y={y(value) - 10}
      fontSize={14}
      fill={'black'}
      alignmentBaseline={'middle'}
      textAnchor={'middle'}
      fontFamily="AvenirNext-Regular"
    >
      {getLabel(index, value)}
    </Text>
  ));

export default ChartLabel;
