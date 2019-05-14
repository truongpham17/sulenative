import React from 'react';
import { View, Text } from 'react-native';
import RowTable from '../../../components/RowTable';
import { iOSUIKit } from 'react-native-typography';
import { Style } from '../../../components';

type PropsType = {
  index: number,
  data: string
};

class DetailItem extends React.Component<PropsType> {
  render() {
    const { index, data } = this.props;
    return (
      <RowTable key={index}>
        {data.map(value => (
          <Text style={Style.normalDarkText} key={value}>
            {value}
          </Text>
        ))}
      </RowTable>
    );
  }
}

export default DetailItem;
