import React from 'react';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import { View } from 'react-native';
import Style from './Style';

class LoadingModal extends React.Component {
  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.1}
      >
        <View style={{ width: 200, height: 200, alignSelf: 'center' }}>
          <LottieView source={Style.image.loading} autoPlay loop />
        </View>
      </Modal>
    );
  }
}

export default LoadingModal;
