import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { Input, Icon, Header } from 'react-native-elements';
import { MenuIcon, Style } from '../../components';
import { logout } from '../../actions';

class ProfileScreen extends React.Component {
  onLogout = () => {
    const { logout, navigation } = this.props;
    logout({ success: () => navigation.navigate('LoginScreen') });
  };
  renderChange() {
    return (
      <View>
        <Input
          placeholder="Tên"
          leftIcon={{ name: 'user', size: 21, type: 'feather', color: Style.color.black }}
          containerStyle={styles.textInputStyle}
          inputStyle={Style.normalDarkText}
          onChangeText={this.onUserNameChange}
          leftIconContainerStyle={{ marginEnd: 4 }}
          value="Nguyễn Thị Trâm Anh"
          //   label={userName.length === 0 ? '' : 'Tên tài khoản'}
          //   errorMessage={emailError}
        />
        <Input
          placeholder="Mật khẩu"
          leftIcon={{ name: 'lock', size: 24, type: 'feather', color: Style.color.black }}
          containerStyle={styles.textInputStyle}
          inputStyle={Style.normalDarkText}
          onChangeText={this.onPasswordChange}
          leftIconContainerStyle={{ marginEnd: 4 }}
          //   value={password}
          secureTextEntry
          //   label={password.length === 0 ? '' : 'Mật khẩu'}
          //   errorMessage={passwordError}
        />
        <Input
          placeholder="Nhập lại mật khẩu"
          leftIcon={{ name: 'lock', size: 24, type: 'feather', color: Style.color.black }}
          containerStyle={styles.textInputStyle}
          inputStyle={Style.normalDarkText}
          onChangeText={this.onPasswordChange}
          leftIconContainerStyle={{ marginEnd: 4 }}
          //   value={password}
          secureTextEntry
          //   label={password.length === 0 ? '' : 'Mật khẩu'}
          //   errorMessage={passwordError}
        />
      </View>
    );
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.containerStyle}>
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={Style.lightHeaderTitle}>Thông tin cá nhân</Text>}
          backgroundColor={Style.color.blackBlue}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
          <KeyboardAvoidingView style={styles.bodyStyle} behavior="padding">
            <Image source={require('../../assets/user_avatar.jpg')} style={styles.imageStyle} />

            {/* <TouchableOpacity style={styles.cameraContainer}>
              <Icon name="camera" type="feather" size={32} color="#ffffff80" />
            </TouchableOpacity> */}

            <View style={styles.contentStyle}>
              <View style={{ height: 80, justifyContent: 'center' }}>
                <Text style={[Style.bigTextEmphasize]}> Nguyễn Thị Trâm Anh</Text>
              </View>
              {this.renderChange()}
              <View
                style={{
                  width: '100%',
                  height: 140,
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}
              >
                <TouchableOpacity
                  // onPress={() => this.setState({ isChange: true })}
                  style={styles.buttonStyle}
                >
                  <Text style={Style.buttonText}>Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.onLogout}>
                  <Text style={Style.buttonText}>Đăng xuất</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: Style.color.background
  },
  bodyStyle: {
    width: '70%',
    height: '60%',
    flexDirection: 'row',
    shadowOffset: { width: 4, height: 4 },
    shadowColor: '#616161',
    shadowOpacity: 0.4,
    backgroundColor: Style.color.white
  },
  imageStyle: {
    height: '104%',
    width: '60%',
    borderRadius: 8,
    position: 'absolute',
    top: -10,
    bottom: -10
  },
  contentStyle: {
    margin: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginStart: '60%'
  },
  buttonStyle: {
    width: 200,
    height: 48,
    borderRadius: 24,
    backgroundColor: Style.color.lightBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInputStyle: {
    width: 300,
    height: 48
  },
  fabContainerStyle: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 400,
    height: 100
  },
  cameraContainer: {
    position: 'absolute',
    top: 0,
    left: '52%',
    width: 54,
    height: 54,
    backgroundColor: '#ffffff50',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default connect(
  null,
  { logout }
)(ProfileScreen);
