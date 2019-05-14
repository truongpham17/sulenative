import React from 'react';
import { View, Animated } from 'react-native';
import Style from './Style';

type PropsType = {
  lineNum: number
};

class Loading extends React.PureComponent<PropsType> {
  constructor(props) {
    super(props);
    this.color = new Animated.Value(0);
  }

  componentDidMount() {
    this.startAnimated(1);
  }

  startAnimated(toValue) {
    const returnValue = toValue === 0 ? 1 : 0;
    Animated.timing(this.color, {
      toValue,
      duration: 1000
    }).start(() => this.startAnimated(returnValue));
  }

  renderItem(i) {
    const width = Math.round(Math.random() * 100);
    const backgroundColor = this.color.interpolate({
      inputRange: [0, 1],
      outputRange: [Style.color.white, Style.color.customDark]
    });
    return <Animated.View style={{ width: `${width}%`, height: 32, backgroundColor }} key={i} />;
  }

  renderList() {
    const arr = [];
    for (let i = 0; i < this.props.lineNum; i++) {
      arr.push(this.renderItem(i));
    }
    return arr;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Style.color.white, justifyContent: 'space-around' }}>
        {this.renderList()}
      </View>
    );
  }
}

export default Loading;
