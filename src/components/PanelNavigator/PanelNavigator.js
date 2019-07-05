import React from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import Item from './Item';
import Style from '../Style';
import { logout } from '../../actions';

const itemKey = [
  'SaleScreen',
  'ImportScreen',
  'SupplyScreen',
  'HistoryScreen',
  'StatictisScreen',
  'ProfileScreen',
  'PayDebt',
  'SetupPrinter',
  'Logout'
];

class Panel extends React.Component {
  onPress = itemKey => {
    this.navigate(itemKey);
  };

  onLogout = () => {
    const { logout } = this.props;
    logout({ success: () => this.navigate('LoginScreen') });
  };

  navigate = itemKey => {
    const { navigation } = this.props;
    navigation.navigate(itemKey);
  };

  render() {
    const { activeItemKey, user } = this.props;
    return (
      <View style={styles.containerStyle}>
        <View style={styles.headerStyle}>
          <View style={{ height: 80, alignItems: 'center', flexDirection: 'row', padding: 10 }}>
            <Image
              source={require('../../assets/icon_1.png')}
              style={{ width: 40, height: 40, marginEnd: 10 }}
            />
            <Text style={[Style.lightHeaderTitle, { fontSize: 36, fontWeight: '600' }]}>
              Innoteq
            </Text>
          </View>
        </View>
        <Item
          title="Bán hàng"
          icon={{ name: 'shopping-cart', size: 24, type: 'feather' }}
          itemKey={itemKey[0]}
          onPress={this.onPress}
          activeItem={activeItemKey}
        />
        <Item
          title="Nhập hàng"
          icon={{ name: 'download', size: 24, type: 'feather' }}
          itemKey={itemKey[1]}
          onPress={this.onPress}
          activeItem={activeItemKey}
        />
        <Item
          title="Nguồn hàng"
          icon={{ name: 'database', size: 24, type: 'feather' }}
          itemKey={itemKey[2]}
          onPress={this.onPress}
          activeItem={activeItemKey}
        />
        <Item
          title="Hoá đơn"
          icon={{ name: 'file-text', size: 24, type: 'feather' }}
          itemKey={itemKey[3]}
          onPress={this.onPress}
          activeItem={activeItemKey}
        />
        {user.role === 1 ? (
        <Item
          title="Thống kê"
          icon={{ name: 'activity', size: 24, type: 'feather' }}
          itemKey={itemKey[4]}
          onPress={this.onPress}
          activeItem={activeItemKey}
        />
         ) : null}
        {user.role === 1 ? (
        <Item
          title="Tài khoản"
          icon={{ name: 'user', size: 24, type: 'feather' }}
          itemKey={itemKey[5]}
          onPress={this.onPress}
          activeItem={activeItemKey}
        />
         ) : null}
         <Item
          title="Quản lý nợ"
          icon={{ name: 'credit-card', size: 24, type: 'feather' }}
          itemKey={itemKey[6]}
          onPress={this.onPress}
          activeItem={activeItemKey}
         />
          <Item
          title="Máy in"
          icon={{ name: 'printer', size: 24, type: 'feather' }}
          itemKey={itemKey[7]}
          onPress={this.onPress}
          activeItem={activeItemKey}
          />
        <Item
          title="Đăng xuất"
          icon={{ name: 'log-out', size: 24, type: 'feather' }}
          itemKey={itemKey[8]}
          onPress={this.onLogout}
          activeItem={activeItemKey}
        />
      </View>
    );
  }
}

export default connect(
  state => ({ user: state.user.info }),
  { logout }
)(Panel);

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: '#40444f'
  },
  itemStyle: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconStyle: {
    width: 40,
    height: 48,
    marginEnd: 12,
    marginStart: 10,
    justifyContent: 'center'
  },
  headerStyle: {
    width: '100%',
    height: 180,
    backgroundColor: Style.color.blackBlue,
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  }
};
