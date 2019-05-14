import React from 'react';
import { createSwitchNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
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

const MainNavigation = createDrawerNavigator(
  {
    SaleScreen,
    ImportScreen,
    SupplyScreen,
    HistoryScreen,
    ProfileScreen,
    StatictisScreen

    // ProfileScreen
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

export { MainApp };
