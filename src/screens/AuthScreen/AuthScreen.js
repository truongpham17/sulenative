import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
// import { Font } from 'expo';

type PropsType = {};

class AuthScreen extends React.Component<PropsType> {
  componentDidMount() {
    const { isLogged, navigation } = this.props;

    if (isLogged) {
      navigation.navigate('MainNavigation');
    } else {
      navigation.navigate('LoginScreen');
    }
  }

  render() {
    return <View />;
  }
}

function mapStateToProps(state) {
  return {
    isLogged: state.user.isLogged
  };
}

export default connect(mapStateToProps)(AuthScreen);
