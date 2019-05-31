import { StyleSheet } from 'react-native';
import { iOSColors } from 'react-native-typography';
import Style from '../Style';

const styles = StyleSheet.create({
  buttonSubmitStyle: {
    width: 80,
    height: 40,
    padding: 0,
    // borderColor: Style.color.lightBlue,
    borderRadius: 5,
    backgroundColor: Style.color.red
  },
  buttonTextStyle: {
    ...Style.buttonText,
    fontSize: 14,
    color: Style.color.white
  },
  buttonEditStyle: {
    width: 80,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: Style.color.blackBlue,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButtonStyle: {
    width: 180,
    height: 40,
    backgroundColor: Style.color.blackBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  switchButtonStyle: {
    height: 44,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Style.color.lightBlue,
    borderWidth: 2,
    paddingHorizontal: 18
  }
});
export default styles;
