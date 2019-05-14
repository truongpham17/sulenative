import React from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { iOSUIKit } from 'react-native-typography';
import { Header } from 'react-native-elements';
import MonthSelector from 'react-native-month-selector';
import { connect } from 'react-redux';
import StoreDetail from './StoreDetail';
import { getReportDetail } from '../../actions';
import DateRangePicker from './DateRangePicker';
import Card from './Card/Card';
import StoreAnalyse from './StoreAnalyse/StoreAnalyse';
import TimeAnalyse from './TimeAnalyse/TimeAnalyse';
import Title from './Title';
import { MenuIcon, Style } from '../../components';
import { ActionButton } from '../../components/button';
import { getReverseDate, getDateFromString, getTwoDigit } from '../../utils/Date';

class StatictisScreen extends React.Component {
  state = {
    modalVisible: false,
    modalType: '',
    start: new Date(),
    end: new Date(),
    selectedStartMonth: undefined,
    selectedEndMonth: undefined,
    storeSelectedId: '',
    type: 'Lợi nhuận' // 'Lợi nhuận', 'Đã bán', 'Còn lại'
  };

  componentDidMount() {
    const { navigation, loadNewData } = this.props;
    this.focusListener = navigation.addListener('didFocus', this.loadNewData);
    // loadNewData();
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  onDatePress = () => {
    this.setState({
      modalVisible: true,
      modalType: 'date'
    });
  };

  onMonthPress = () => {
    this.setState({
      modalVisible: true,
      modalType: 'month'
    });
  };

  onSelection = item => {
    this.setState({
      type: item
    });
  };

  getStoreDetailData() {
    const { reportByStore } = this.props;
    const value = reportByStore.find(item => item.store._id === this.state.storeSelectedId);
    if (!value) {
      return {
        store: {}
      };
    }
    return value;
  }

  loadNewData = () => {
    const { getReportDetail } = this.props;
    const { start, end } = this.state;
    getReportDetail({ start: start.toJSON(), end: end.toJSON() });
  };

  renderDateModal() {
    const currentDate = getReverseDate();
    return (
      <View>
        <Text style={styles.titleStyle}>Chọn ngày</Text>
        <DateRangePicker
          initialRange={[currentDate, currentDate]}
          onSuccess={(s, e) => {
            this.setState({
              start: getDateFromString(s),
              end: getDateFromString(e)
            });
          }}
        />
        <ActionButton
          title="Xong"
          buttonStyle={styles.buttonStyle}
          onPress={() => {
            this.setState({
              modalType: '',
              modalVisible: false
            });
            this.loadNewData();
          }}
        />
      </View>
    );
  }

  renderMonthModal() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.titleStyle}>Chọn tháng</Text>
        <View style={styles.monthPickerContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.subHeadStyle}>Từ tháng</Text>
            <MonthSelector
              containerStyle={{ flex: 1, padding: 10 }}
              onMonthTapped={date => {
                this.setState({
                  selectedStartMonth: date,
                  start: getDateFromString(date.format('YYYY-MM-DD'))
                });
              }}
              selectedDate={this.state.selectedStartMonth}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.subHeadStyle}>Đến tháng</Text>
            <MonthSelector
              containerStyle={{ flex: 1, padding: 10 }}
              onMonthTapped={date => {
                this.setState({
                  selectedEndMonth: date,
                  end: getDateFromString(date.format('YYYY-MM-DD'))
                });
              }}
              selectedDate={this.state.selectedEndMonth}
            />
          </View>
        </View>
        <ActionButton
          title="Xong"
          onPress={() => {
            this.setState({ modalVisible: false, modalType: '' });
            this.loadNewData();
          }}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    );
  }

  renderModal() {
    const { modalVisible, modalType } = this.state;
    return (
      <Modal
        visible={modalVisible}
        onRequestClose={() => this.setState({ modalVisible: false, modalType: '' })}
        transparent={false}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1, marginTop: '20%' }}>
          {modalType === 'date' ? this.renderDateModal() : this.renderMonthModal()}
        </SafeAreaView>
      </Modal>
    );
  }

  render() {
    const { navigation, billCount, totalSoldMoney, reportByTime, reportByStore } = this.props;
    const { start, end, type } = this.state;
    return (
      <View style={styles.containerStyle}>
        <MenuIcon navigation={navigation} />
        <Header
          placement="center"
          centerComponent={<Text style={iOSUIKit.title3EmphasizedWhite}>Thống kê</Text>}
          backgroundColor={Style.color.blackBlue}
        />
        {this.renderModal()}
        <View style={styles.contentStyle}>
          <Title
            containerStyle={{ marginBottom: 20 }}
            onDatePress={this.onDatePress}
            onMonthPress={this.onMonthPress}
            start={`${getTwoDigit(start.getMonth() + 1)}-${start.getFullYear()}`}
            end={`${getTwoDigit(end.getMonth() + 1)}-${end.getFullYear()}`}
          />
          <View style={styles.topViewStyle}>
            <TimeAnalyse containerStyle={styles.timeContainerStyle} data={reportByTime} />
            <Card billCount={billCount} totalSoldMoney={totalSoldMoney} navigation={navigation} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <StoreAnalyse
              stores={reportByStore}
              containerStyle={[styles.storeContainerStyle, { marginEnd: 10, flex: 2 }]}
              storeSelectedId={this.state.storeSelectedId}
              onChange={value => this.setState({ storeSelectedId: value })}
              selectedOption={type}
              onSelection={this.onSelection}
            />
            <StoreDetail
              containerStyle={[styles.storeContainerStyle, { marginStart: 10 }]}
              data={this.getStoreDetailData()}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topViewStyle: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: Style.color.white,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  contentStyle: {
    flex: 1,
    margin: 20
  },
  containerStyle: {
    flex: 1,
    backgroundColor: Style.color.background
  },
  timeContainerStyle: {
    flex: 3,
    paddingTop: 20,
    paddingStart: 20,
    paddingEnd: 20
  },
  storeContainerStyle: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: Style.color.white,
    marginTop: 20
  },
  titleStyle: {
    ...Style.blackEmphasizeTitle,
    width: '100%',
    textAlign: 'center',
    marginBottom: 32
  },
  subHeadStyle: {
    ...Style.blackTitle,
    width: '100%',
    textAlign: 'center'
  },
  buttonStyle: {
    alignSelf: 'center',
    marginTop: 10
  },
  monthPickerContainer: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default connect(
  state => ({
    stores: state.store.stores,
    billCount: state.report.billCount,
    totalSoldMoney: state.report.totalSoldMoney,
    reportByTime: state.report.reportByTime,
    reportByStore: state.report.reportByStore
  }),
  { getReportDetail }
)(StatictisScreen);
