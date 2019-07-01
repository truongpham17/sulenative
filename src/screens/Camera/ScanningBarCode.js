import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class BarcodeScan extends Component {
  state = {
    barcodes: [],
    type: 'back',
    isScanned: false
  }

  componentDidMount() {
    this.onScanningSuccess = this.props.navigation.getParam('onScanningSuccess', () => { });
  }
  scanning = barcode => {
    if (!this.state.isScanned) {
      if (!isNaN(barcode.data)) {
        this.onScanningSuccess(parseInt(barcode.data, 10) / 123579);
        console.log(parseInt(barcode.data, 10) / 123579);
      }
      this.setState({ isScanned: true });
      console.log(barcode.data);
      this.props.navigation.pop();
    }
  }
  render() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        type={this.state.type}
        style={{
          flex: 1,
          width: '100%',
        }}
        onBarCodeRead={barcode => this.scanning(barcode)}
      />
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cameraIcon: {
    margin: 5,
    height: 40,
    width: 40
  },
  bottomOverlay: {
    position: 'absolute',
    width: '100%',
    flex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});
