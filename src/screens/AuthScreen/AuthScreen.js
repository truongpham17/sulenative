import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { getUserInfo } from '../../actions';
// import { Font } from 'expo';

type PropsType = {};

class AuthScreen extends React.Component<PropsType> {

  componentDidMount() {
    const { isLogged, navigation, getUserInfo, user } = this.props;

    if (isLogged) {
      getUserInfo(user._id, {
        success: () => this.onCheckValidateUser(),
        failure: () => navigation.navigate('LoginScreen')
      });
    } else {
      navigation.navigate('LoginScreen');
    }
  }

  onCheckValidateUser = () => {
    const { user, navigation } = this.props;
    if (!user.active) {
      navigation.navigate('LoginScreen');
    } else {
      // for product
      navigation.navigate('SetupPrinter');

      // for testing
      // navigation.navigate('MainNavigation');
    }
  }

  render() {
    return <View />;
  }
}

function mapStateToProps(state) {
  return {
    isLogged: state.user.isLogged,
    user: state.user.info
  };
}

export default connect(mapStateToProps, { getUserInfo })(AuthScreen);
