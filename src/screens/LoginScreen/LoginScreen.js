import React from 'react';
import { Text, StyleSheet, ImageBackground, KeyboardAvoidingView, View, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { login, loadStore } from '../../actions';
import { Style } from '../../components';

type PropsType = {
  login: () => null
};
type StateType = {
  userName: string,
  password: string,
  error: boolean,
  passwordError: string,
  emailError: string
};

class LoginScreen extends React.Component<PropsType, StateType> {
  state = {
    userName: '',
    password: '',
    error: false,
    passwordError: '',
    emailError: ''
  };

  onUserNameChange = userName => {
    this.setState({
      userName
    });
  };

  onPasswordChange = password => {
    this.setState({
      password
    });
  };

  login = () => {
    const { navigation, login, loadStore } = this.props;
    const { userName, password } = this.state;
    // navigation.navigate('MainNavigation');
    // return;
    let flat = true;
    if (password.length < 6) {
      this.setState({
        passwordError: 'Mật khẩu phải có ít nhất 6 kí tự',
        emailError: ''
      });
      flat = false;
    }

    if (userName.length === 0) {
      this.setState({
        emailError: 'Vui lòng nhập tên tài khoản',
        passwordError: ''
      });
      flat = false;
    }
    if (!flat) return;
    const data = {
      username: userName,
      password
    };
    login(data, {
      success: () => {
        loadStore({ success: () => navigation.navigate('MainNavigation') });
      },
      failure: () => {
        this.setState({
          passwordError: 'Tên tài khoản hoặc mật khẩu chưa đúng',
          emailError: 'Tên tài khoản hoặc mật khẩu chưa đúng'
        });
      }
    });
  };

  render() {
    const { userName, password, emailError, passwordError } = this.state;
    return (
      <ImageBackground
        style={styles.containeStyle}
        source={require('../../assets/background_2.jpeg')}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          behavior="padding"
          keyboardVerticalOffset={-280}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('../../assets/icon_1.png')} style={{ width: 40, height: 40 }} />
            <Text style={[Style.blackTitle, { fontSize: 42, marginStart: 10 }]}>Innoteq.vn</Text>
          </View>

          <View style={styles.cardStyle}>
            <Text style={[Style.blackHeaderTitle, { fontSize: 24 }]}>Đăng nhập</Text>
            <View>
              <Input
                placeholder="Tên tài khoản"
                leftIcon={{ name: 'user', size: 20, type: 'antdesign', color: Style.color.black }}
                containerStyle={styles.textInputStyle}
                inputStyle={[Style.normalDarkText, { marginStart: 12 }]}
                onChangeText={this.onUserNameChange}
                value={userName}
                // label={userName.length === 0 ? '' : 'Tên tài khoản'}
                errorMessage={emailError}
                placeholderTextColor={Style.color.black}
                // labelStyle={[
                //   Style.normalDarkText,
                //   { color: Style.color.placeholder, fontWeight: '400' }
                // ]}
                returnKeyType="next"
                onSubmitEditing={() => this.ref.focus()}
              />
              <Input
                placeholder="Mật khẩu"
                leftIcon={{ name: 'lock', size: 20, type: 'feather', color: Style.color.black }}
                containerStyle={styles.textInputStyle}
                inputStyle={[Style.normalDarkText, { marginStart: 12 }]}
                onChangeText={this.onPasswordChange}
                value={password}
                secureTextEntry
                // label={password.length === 0 ? '' : 'Mật khẩu'}
                errorMessage={passwordError}
                placeholderTextColor={Style.color.black}
                // labelStyle={[
                //   Style.normalDarkText,
                //   { color: Style.color.placeholder, fontWeight: '400' }
                // ]}
                returnKeyType="done"
                ref={ref => (this.ref = ref)}
                onSubmitEditing={this.login}
              />
            </View>

            <Button
              type="solid"
              title="Đăng nhập"
              buttonStyle={styles.buttonStyle}
              onPress={this.login}
              titleStyle={Style.buttonText}
            />
          </View>
        </KeyboardAvoidingView>
        <Spinner visible={this.props.loading} color={Style.color.lightBlue} />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  containeStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.color.white
  },
  textInputStyle: {
    width: 300,
    height: 64
  },
  horizontalBar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%'
  },
  buttonStyle: {
    width: 300,
    height: 48,
    borderRadius: 24,
    backgroundColor: Style.color.lightBlue
  },
  cardStyle: {
    width: 340,
    height: 400,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Style.color.background
  }
});

// function mapStateToProps(state) {
//   return {
//     userInfo: state.user.info
//   }
// }

const mapDispatchToProps = {
  login,
  loadStore
};

export default connect(
  state => ({ loading: state.user.loading }),
  mapDispatchToProps
)(LoginScreen);
