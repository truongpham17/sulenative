import React from 'react';
import { View } from 'react-native';
import { createSwitchNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { setDialogStatus } from './actions';
import {
  HistoryScreen,
  ImportScreen,
  LoginScreen,
  SaleScreen,
  StatictisScreen,
  SupplyScreen,
  AuthScreen,
  ProfileScreen
} from './screens';
import { PanelNavigator } from './components/PanelNavigator';
import { DialogStatus } from './components';

const MainNavigation = createDrawerNavigator(
  {
    SaleScreen,
    ImportScreen,
    SupplyScreen,
    HistoryScreen,
    ProfileScreen,
    StatictisScreen
  },
  {
    contentComponent: PanelNavigator,
    drawerWidth: 300
  }
);

const AppNavigation = createSwitchNavigator(
  {
    AuthScreen,
    LoginScreen,
    MainNavigation
  },
  {
    initialRouteName: 'AuthScreen'
  }
);

const MainApp = createAppContainer(AppNavigation);

class Application extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <DialogStatus
          visible={this.props.showDialog}
          type={this.props.dialogType}
          onBackdropPress={() => this.props.setDialogStatus({ showDialog: false })}
        />
        <MainApp />
      </View>
    );
  }
}

export default connect(
  state => ({
    showDialog: state.app.showDialog,
    dialogType: state.app.dialogType
  }),
  { setDialogStatus }
)(Application);
