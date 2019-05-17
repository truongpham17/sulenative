import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import React from 'react';
import { Icon } from 'react-native-elements';
import { Text, View } from 'react-native';
import DetailInfo from './DetailInfo';
import History from './History';
import Info from './Info';
import { Style } from '../../../../components';

class TabDetail extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'info', title: 'Thông tin', icon: 'trending-up' },
      { key: 'detail', title: 'Sản phẩm', icon: 'list' },
      { key: 'history', title: 'Lịch sử', icon: 'rotate-ccw' }
    ]
  };

  renderLabel = ({ route, focused }) => (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 7 }}>
      <Icon
        size={24}
        color={focused ? Style.color.blackBlue : Style.color.gray}
        name={route.icon}
        type="feather"
        containerStyle={{ width: 32, height: 32, marginEnd: 8, justifyContent: 'center' }}
      />
      <Text
        style={[Style.textEmphasize, { color: focused ? Style.color.blackBlue : Style.color.gray }]}
      >
        {route.title}
      </Text>
    </View>
  );

  renderTabBar = props => (
    <TabBar
      {...props}
      renderLabel={this.renderLabel}
      style={{
        backgroundColor: Style.color.darkBackground,
        height: 65,
        shadowOffset: { width: 0, height: -1 },
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
      }}
      indicatorStyle={{ height: 0 }}
      renderLabel={this.renderLabel}
    />
  );
  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          info: Info,
          detail: DetailInfo,
          history: History
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ flex: 1 }}
        renderTabBar={this.renderTabBar}
        tabBarPosition="top"
        swipeEnabled={false}
      />
    );
  }
}

export default TabDetail;
