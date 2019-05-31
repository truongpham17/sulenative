import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { Icon } from 'react-native-elements';
import Style from './Style';
import { logout } from '../actions';
import { TouchableOpacity } from 'react-native-gesture-handler';

const itemKey = [
  'SaleScreen',
  'ImportScreen',
  'SupplyScreen',
  'HistoryScreen',
  'StatictisScreen',
  'ProfileScreen',
  'Logout'
];

const icons = [
  { name: 'shopping-cart', size: 24, type: 'feather', color: Style.color.white },
  { name: 'download', size: 24, type: 'feather', color: Style.color.white },
  { name: 'database', size: 24, type: 'feather', color: Style.color.white },
  { name: 'file-text', size: 24, type: 'feather', color: Style.color.white },
  { name: 'activity', size: 24, type: 'feather', color: Style.color.white },
  { name: 'user', size: 24, type: 'feather', color: Style.color.white },
  { name: 'log-out', size: 24, type: 'feather', color: Style.color.white }
];
class MenuBar extends React.PureComponent {
  onPress = index => {
    this.props.navigation.navigate(itemKey[index]);
  };
  render() {
    return (
      <View
        style={{
          width: 52,
          height: '102%',
          backgroundColor: '#40444f',
          paddingTop: 15,
          marginTop: -1
        }}
      >
        {icons.map((item, index) => {
          if ((index !== 4 && index !== 5) || this.props.user.role === 1) {
            return (
              <TouchableOpacity
                onPress={() => this.onPress(index)}
                style={{
                  marginVertical: 15,
                  paddingVertical: 4
                  // borderRadius: 4,
                  // backgroundColor: Style.color.background
                }}
              >
                <Icon {...item} />
              </TouchableOpacity>
            );
          }

          return null;
        })}
      </View>
    );
  }
}
export default connect(
  state => ({ user: state.user.info }),
  { logout }
)(MenuBar);
