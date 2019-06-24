import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import React from 'react';
import { Icon } from 'react-native-elements';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Style } from '../../../components';
import SelectCustomer from './SelectCustomer';
import NewCustomer from './NewCustomer';

class TabDetail extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'select', title: 'Khách cũ', icon: 'user' },

      { key: 'new', title: 'Khách mới', icon: 'user-plus' },
    ]
  };

  onIndexChange = index => {
      this.setState({ index });
  };

  renderLabel = ({ route, focused }) => (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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
        height: 48,
        shadowOffset: { width: 0, height: -1 },
      }}
      indicatorStyle={{ height: 0 }}
    />
  );
  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          new: () => <NewCustomer onSelectCustomer={this.props.onSelectCustomer} />,
          select: () => <SelectCustomer onSelectCustomer={this.props.onSelectCustomer} />
        })}
        onIndexChange={this.onIndexChange}
        initialLayout={{ flex: 1 }}
        renderTabBar={this.renderTabBar}
        tabBarPosition="top"
        swipeEnabled
        style={{ width: 440, height: 100, alignSelf: 'center', padding: 10, backgroundColor: 'white' }}
      />
    );
  }
}

export default TabDetail;

