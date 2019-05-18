import React, { Component } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';
import {
  BluetoothEscposPrinter,
  //   Device
} from 'react-native-bluetooth-escpos-printer';

class BillTemplate extends Component {
  state = { img: null };

  componentDidMount = () => {
    this.refs.viewShot.capture().then(async data => {
      this.setState({ img: `data:image/png;base64,${data}` });
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
      await BluetoothEscposPrinter.printText('Hello\r\n', {});
      await BluetoothEscposPrinter.setWidth(530);
      Alert.alert(data);
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA8FBMVEUAAABCQkJDQ0NFRUU/Pz9BQUFAQEBERERDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0MAAAA0ZZMIAAAATnRSTlMAAAAAAAAAABWFz8JdBQFHt9OYIxSi/PBsBFHjvCSk/vJt5b7mo26h75ziIZkD1csRXvpziwvx+QadveRSSA3XF6r31DMPOSLWzMTZFgd4wftfAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAaBJREFUSMe11dlSwjAUgOE2WmUTQRBtBQVBREREQEVUFkHcz/s/jklbQ7YOhwtz2fzftJ1OTi0rWDaJxRPJ1A6xxEXSu5nsXo7Ylrpskt8vABwcuqIgG94RABRLmtgk+eMTugXliiAI8U7ZRaiqwvnrJUH7WnBRFfR5zsKeinoohN4XRHyeZc8F2RJ6SSh9KJReeCpH7QOh9st76L3/5lrPRf5c6wEaF039IlQvmYgXAL1aVxQk8D20YxQk1wDXHQpuGui+22Pv4FbK2L5/639Rt44TYY8WvEcKoUcJqUcIpV8ptN4Xd5H9vd5TMXiIBMOOoXe8x0igzJKgf6pB9JJmCaIXJkPYb6/oFYHoJYHqxXllo/qlcDxcz8VzE9lTkWInLoPuAZIjCrJrgPGEgtYaYDqgIFc07LwMTbNkNmfvQEpVbafbfzXMkvbCn622Lth50adP2BuEf740MVvwP4oi+LyShNArQphXgpB69v/jQppXXCi9IJR5FQqt50KbV74w9Ey8td4/etq8Sn1+TeeGngn3u5PW7myPJj/G/v/WL4DMswebZ4AxAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTA2LTI1VDA4OjQ0OjQ2KzA4OjAww1b9dwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wNi0yNVQwODo0NDo0NiswODowMLILRcsAAAAASUVORK5CYII=';
      await BluetoothEscposPrinter.printPic(base64Image, { width: 200, left: 40 });
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
    });
  }

  render() {
    const { img } = this.state;
    return (
      <ViewShot ref="viewShot" options={{ result: 'base64' }}>
        <View>
          <Text>DŨNG LIÊN</Text>
          <Text>Địa chỉ: Quận 12, TP Hồ Chí Minh</Text>
          <Image style={{ width: 300, height: 200 }} source={{ uri: img }} />
        </View>
      </ViewShot>
    );
  }
}

export default BillTemplate;
