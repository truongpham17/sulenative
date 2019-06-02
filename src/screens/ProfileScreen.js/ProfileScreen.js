import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import { MenuIcon, Style, LeftPanel, MenuBar, LoadingModal } from '../../components';
import RightPanel from './RightPanel';
import { logout, getUser, selectUser, addUser, updateUser, setDialogStatus } from '../../actions';
import { AlertInfo } from '../../utils/Dialog';

class ProfileScreen extends React.Component {
  state = {
    refreshing: false,
    modalVisible: false,
    modalType: ''
  };
  componentDidMount() {
    // this.focusListener = navigation.addListener('didFocus', this.getUser);
    setTimeout(() => {
      console.log(this.props.users);
    }, 1000);
  }

  onLogout = () => {
    const { logout, navigation } = this.props;
    logout({ success: () => navigation.navigate('LoginScreen') });
  };

  onLongPress = () => {};

  onSelectedUser = id => {
    const { selectUser } = this.props;
    selectUser(id);
  };

  onEditPress = () => {
    this.setState({
      modalVisible: true,
      modalType: 'edit'
    });
  };

  onAddNewPress = () => {
    this.setState({
      modalVisible: true,
      modalType: 'add'
    });
  };

  onPressOutSide = () => {
    this.setState({
      modalVisible: false
    });
  };

  onAddUser = ({ username, password, fullname, role }) => {
    const { addUser, users, setDialogStatus } = this.props;
    const checkDuplicateUser = users.find(item => item.username === username);
    if (checkDuplicateUser) {
      AlertInfo('Tên tài khoản này đã được sử dụng');
      return;
    }
    addUser(
      { username, password, fullname, role },
      {
        success: () => {
          this.getUser();
          this.setState({
            modalVisible: false
          });
          setTimeout(() => {
            setDialogStatus({ showDialog: true, dialogType: 'success' });
          }, 500);
        },
        failure: () => {
          AlertInfo('Lỗi!, Vui lòng thử lại');
        }
      }
    );
  };

  onUpdateUser = ({ role, fullname, password, active }) => {
    const { updateUser, currentUser, getUser } = this.props;
    const { _id } = currentUser;
    if (password && password.length < 6) {
      AlertInfo('Mật khẩu phải có ít nhất 6 kí tự!');
    }
    let userActive;
    if (active === null) {
      userActive = currentUser.active;
    } else {
      userActive = active;
    }
    let userRole = 0;
    if (!role || role === 0) {
      userRole = 0;
    } else {
      userRole = 1;
    }
    const data = {
      fullname: fullname || currentUser.fullname || '',
      role: userRole,
      active: userActive
    };
    const passwordData = password ? { password: password || currentUser.password } : {};
    updateUser(
      _id,
      { ...data, ...passwordData },
      {
        success: () => {
          getUser(() => this.onSelectedUser(_id));
          // this.onSelectedUser(currentUser.id);
          this.setState({ modalVisible: false });
        },
        failure: () => AlertInfo('Thất bại, vui lòng thử lại')
      }
    );
  };

  getUser = () => {
    const { getUser } = this.props;
    this.setState({ refreshing: true });
    getUser(() => this.setState({ refreshing: false }));
  };

  extractStoreData = () => {
    const { users } = this.props;
    if (!users) return [];
    return users.map(item => ({
      name: item.fullname || '',
      date: '',
      info1: item.role === 1 ? 'ADMIN' : 'Nhân viên',
      info2: item.active ? 'ACTIVE' : 'INACTIVE',
      id: item._id
    }));
  };
  render() {
    const { navigation, currentUser } = this.props;
    return (
      <View style={styles.containerStyle}>
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={Style.lightHeaderTitle}>Quản lý tài khoản</Text>}
          backgroundColor={Style.color.blackBlue}
        />
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Style.color.background }}>
          <MenuBar navigation={navigation} />
          <View style={{ flex: 3, margin: 10, borderRadius: 10, backgroundColor: 'white' }}>
            <LeftPanel
              containerStyle={{ flex: 1 }}
              title="Nhân viên"
              data={this.extractStoreData()}
              onLongPress={this.onLongPress}
              onPress={this.onSelectedUser}
              activeId={currentUser._id}
              onAddStore={this.onAddNewPress}
              refreshing={this.state.refreshing}
              onRefresh={this.getUser}
              showDialog={this.onAddNewPress}
            />
          </View>
          <View style={styles.rightPanel}>
            <RightPanel
              onEditPress={this.onEditPress}
              onPressOutSide={this.onPressOutSide}
              modalVisible={this.state.modalVisible}
              modalType={this.state.modalType}
              addUser={this.onAddUser}
              onUpdateUser={this.onUpdateUser}
            />
          </View>
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
  rightPanel: {
    flex: 7,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    marginStart: 0,
    backgroundColor: Style.color.darkBackground,
    overflow: 'hidden',
    flexDirection: 'row'
  }
});

export default connect(
  state => ({
    users: state.user.users,
    loading: state.user.loading,
    currentUser: state.user.currentUser
  }),
  { logout, getUser, selectUser, addUser, updateUser, setDialogStatus }
)(ProfileScreen);
