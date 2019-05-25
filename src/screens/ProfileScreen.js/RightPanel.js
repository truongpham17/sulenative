import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { Style } from '../../components';
import { SubmitButton } from '../../components/button';
import { Alert, AlertInfo } from '../../utils/Dialog';

const ROLE = [{ value: 'Nhân viên' }, { value: 'ADMIN' }];

const INITIAL_STATE = {
  role: null,
  fullname: null,
  password: null,
  repassword: null,
  active: null,
  username: null
};

class RightPanel extends React.Component {
  state = INITIAL_STATE;

  onSetStatus = value => {
    if (value) {
      this.setState({
        active: true
      });
      return;
    }

    Alert(
      'Đóng băng tài khoản?',
      'Một khi bạn đóng băng tài khoản, tài khoản này không thể đăng nhập vào được nữa',
      'Huỷ',
      'Inactive',
      () => this.setState({ active: false })
    );
  };

  onUpdateUser = () => {
    const { onUpdateUser } = this.props;
    const { role, fullname, password, repassword, active } = this.state;
    console.log(role);
    if (password && password.length < 6) {
      AlertInfo('Mật khẩu phải có ít nhất 6 kí tự!');
      return;
    }
    if (password !== repassword) {
      AlertInfo('Mật khẩu nhập lại chưa đúng!');
      return;
    }
    if (onUpdateUser) {
      onUpdateUser({
        fullname,
        role: role === 'ADMIN' ? 1 : 0,
        password,
        active
      });
    }
  };

  onAddUser = () => {
    const { addUser } = this.props;
    const { username, fullname, password, repassword, role } = this.state;
    if (!username || username.length === 0 || !fullname || fullname.length === 0 || !role) {
      AlertInfo('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (username.length < 6) {
      AlertInfo('Tên đăng nhập ít nhất 6 ký tự!');
      return;
    }
    if (password.length < 6) {
      AlertInfo('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    if (password !== repassword) {
      AlertInfo('Mật khẩu nhập lại chưa đúng!');
      return;
    }

    addUser({ username, password, fullname, role: role === 'ADMIN' ? 1 : 0 });
  };

  renderModal = () => {
    const { currentUser } = this.props;
    let active;
    if (this.state.active === null) {
      active = currentUser.active;
    } else {
      active = this.state.active;
    }
    return (
      <View style={styles.editContainerStyle}>
        <Text style={[Style.bigTextEmphasize, { textAlign: 'center' }]}>Sửa thông tin</Text>
        <View style={styles.itemStyle}>
          <Text style={Style.normalDarkText}>Tên đăng nhập: </Text>
          <Text style={Style.textEmphasize}>{currentUser.username}</Text>
        </View>
        <View style={styles.itemStyle}>
          <Text style={[Style.normalDarkText, { paddingTop: 2 }]}>Họ và tên: </Text>
          <TextInput
            style={styles.textInputStyle}
            value={this.state.fullname || currentUser.fullname}
            onChangeText={text => this.setState({ fullname: text })}
          />
        </View>

        <View style={styles.itemStyle}>
          <Text style={Style.normalDarkText}>Role: </Text>
          <Dropdown
            data={ROLE}
            label="Role"
            value={ROLE[currentUser.role || 0].value}
            onChangeText={role => this.setState({ role })}
            containerStyle={{ width: 120, marginBottom: 4 }}
            dropdownOffset={{ top: 0, left: 0 }}
            label=""
          />
        </View>
        <View style={styles.itemStyle}>
          <Text style={Style.normalDarkText}>Mật khẩu: </Text>
          <TextInput
            style={styles.textInputStyle}
            value={this.state.password || ''}
            onChangeText={text => this.setState({ password: text })}
            secureTextEntry
          />
        </View>
        <View style={styles.itemStyle}>
          <Text style={Style.normalDarkText}>Nhập lại mật khẩu: </Text>
          <TextInput
            style={styles.textInputStyle}
            value={this.state.repassword || ''}
            onChangeText={text => this.setState({ repassword: text })}
            secureTextEntry
          />
        </View>
        <View style={styles.itemStyle}>
          <Text style={Style.normalDarkText}>User Active: </Text>
          <View style={{ width: 120, alignItems: 'flex-end', marginBottom: 4 }}>
            <Switch value={active} onValueChange={value => this.onSetStatus(value)} />
          </View>
        </View>
        <SubmitButton
          buttonStyle={{ width: '96%', alignSelf: 'center' }}
          title="Xong"
          onPress={() => this.onUpdateUser()}
        />
      </View>
    );
  };

  renderAddNewModal = () => {
    const { modalType } = this.props;
    if (modalType !== 'add') return <View />;
    return (
      <View style={styles.editContainerStyle}>
        <Text style={[Style.bigTextEmphasize, { textAlign: 'center' }]}>Thêm nhân viên</Text>
        <View style={styles.itemStyle}>
          <Text style={Style.normalDarkText}>Tên đăng nhập: </Text>
          <TextInput
            style={styles.textInputStyle}
            value={this.state.username || ''}
            onChangeText={text => this.setState({ username: text })}
          />
        </View>
        <View style={styles.itemStyle}>
          <Text style={[Style.normalDarkText, { paddingTop: 2 }]}>Họ và tên: </Text>
          <TextInput
            style={styles.textInputStyle}
            value={this.state.fullname || ''}
            onChangeText={text => this.setState({ fullname: text })}
          />
        </View>

        <View style={styles.itemStyle}>
          <Text style={Style.normalDarkText}>Role: </Text>
          <Dropdown
            data={ROLE}
            label="Role"
            onChangeText={role => this.setState({ role })}
            containerStyle={{ width: 120, marginBottom: 4 }}
            dropdownOffset={{ top: 0, left: 0 }}
            label=""
          />
        </View>
        <View style={styles.itemStyle}>
          <Text style={Style.normalDarkText}>Mật khẩu: </Text>
          <TextInput
            style={styles.textInputStyle}
            value={this.state.password}
            onChangeText={text => this.setState({ password: text })}
            secureTextEntry
          />
        </View>
        <View style={styles.itemStyle}>
          <Text style={Style.normalDarkText}>Nhập lại mật khẩu: </Text>
          <TextInput
            style={styles.textInputStyle}
            value={this.state.repassword}
            onChangeText={text => this.setState({ repassword: text })}
            secureTextEntry
          />
        </View>

        <SubmitButton
          buttonStyle={{ width: '96%', alignSelf: 'center' }}
          title="Xác nhận"
          onPress={() => this.onAddUser()}
        />
      </View>
    );
  };
  render() {
    const { currentUser } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Text style={[Style.bigTextEmphasize, { textAlign: 'center' }]}>Thông tin nhân viên</Text>

        <View style={styles.containerStyle}>
          <Text style={[Style.normalDarkText]}>
            Tên đăng nhập: <Text style={Style.textEmphasize}>{currentUser.username}</Text>
          </Text>
          <Text style={[Style.normalDarkText]}>
            Họ và tên: <Text style={Style.textEmphasize}>{currentUser.fullname}</Text>
          </Text>
        </View>
        <SubmitButton
          title="Sửa thông tin"
          onPress={this.props.onEditPress}
          buttonStyle={{ width: 200, marginTop: 20, alignSelf: 'center' }}
        />

        <Modal
          isVisible={this.props.modalVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          onBackdropPress={() => {
            this.props.onPressOutSide();
            this.setState({ ...INITIAL_STATE });
          }}
          hideModalContentWhileAnimating
          backdropOpacity={0.4}
        >
          {this.props.modalType === 'edit' ? this.renderModal() : this.renderAddNewModal()}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputStyle: {
    paddingStart: 4,
    ...Style.textEmphasize,
    width: 120,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    paddingEnd: 4,
    paddingVertical: 2,
    marginEnd: -4
  },
  itemStyle: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center'
  },
  editContainerStyle: {
    marginTop: -260,
    width: '30%',
    height: '60%',
    alignSelf: 'center',
    backgroundColor: Style.color.white,
    justifyContent: 'space-around',
    padding: 10
  },
  containerStyle: {
    padding: 10,
    backgroundColor: Style.color.white,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 26,
    height: 160,
    justifyContent: 'space-around'
  }
});

export default connect(
  state => ({ currentUser: state.user.currentUser, userList: state.user.users }),
  null
)(RightPanel);
