import React from 'react';
import { Text } from 'react-native-svg';

const PieLabels = ({ slices, getLabel }) =>
  slices.map((slice, index) => {
    const { pieCentroid, data } = slice;
    return (
      <Text
        key={index}
        x={pieCentroid[0]}
        y={pieCentroid[1]}
        fill={'white'}
        textAnchor={'middle'}
        alignmentBaseline={'middle'}
        fontSize={14}
        stroke={'white'}
        strokeWidth={0.2}
      >
        {data.label}
      </Text>
    );
  });

export default PieLabels;
