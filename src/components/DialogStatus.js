import React from 'react';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import { View, Text } from 'react-native';
import Style from './Style.js';
import { iOSColors } from 'react-native-typography';

class DialogStatus extends React.Component {
  render() {
    let source;
    switch (this.props.type) {
      case 'success':
        return (
          <Modal
            isVisible={this.props.visible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropOpacity={0.2}
            onBackdropPress={this.props.onBackdropPress}
          >
            <View style={{ width: 200, height: 200, alignSelf: 'center' }}>
              <View style={{ flex: 1 }}>
                <LottieView source={Style.image.success} autoPlay loop={false} />
              </View>
              <Text
                style={[{ textAlign: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: iOSColors.green }, Style.greenBigTitle]}
              >
                Thành công 🤗
              </Text>
            </View>
          </Modal>
        );
      case 'error':
        return (
          <Modal
            isVisible={this.props.visible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropOpacity={0.2}
            onBackdropPress={this.props.onBackdropPress}
          >
            <View style={{ width: 200, height: 200, alignSelf: 'center' }}>
              <View style={{ flex: 1 }}>
                <LottieView source={Style.image.erorr} autoPlay loop />
              </View>
              <Text
                style={[
                  Style.greenBigTitle,
                  { textAlign: 'center', color: iOSColors.red, backgroundColor: 'white' }
                ]}
              >
                Thất bại 😢
              </Text>
            </View>
          </Modal>
        );
      default:
        return null;
    }
  }
}

export default DialogStatus;
