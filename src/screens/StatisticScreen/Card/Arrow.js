import React from 'react';
import Svg, { G, Rect, Circle, Text, TSpan, Path } from 'react-native-svg';
import { Style } from '../../../components';

const SvgComponent = props => (
  <Svg width={240} height={130} {...props}>
    <G transform="translate(-500 -77)" fill="none" fillRule="evenodd">
      <Rect fill={Style.color.lightBlue} x={500} y={77} width="100%" height={130} rx={5} />
      <G transform="translate(531 95)">
        <Circle fill={Style.color.white} cx={7.5} cy={7.5} r={10} />
        <Text
          fontFamily="AvenirNext-Regular"
          fontSize={11}
          fontWeight="bold"
          fill={Style.color.lightBlue}
        >
          <TSpan x={4} y={11}>
            {'+'}
          </TSpan>
        </Text>
      </G>
      <Text fontFamily="AvenirNext-Regular" fontSize={15} fontWeight="400" fill={Style.color.white}>
        <TSpan x={531} y={140}>
          {'Tạo hoá đơn '}
        </TSpan>
        <TSpan x={531} y={158}>
          {'mới'}
        </TSpan>
      </Text>
      <G stroke={Style.color.white} strokeWidth={1.5}>
        <Path d="M585.56 152.5h45.88" strokeLinecap="square" />
        <Path d="M625 146l8 6.404-8 5.596" />
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
