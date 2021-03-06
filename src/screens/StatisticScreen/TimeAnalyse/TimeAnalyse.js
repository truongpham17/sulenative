import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import Tooltip from './Tooltip';
import Circle from './Circle';
import { Style } from '../../../components';

const xAxisHeight = 30;
const verticalContentInset = { top: 10, bottom: 10, left: 40, right: 40 };

const axesSvg = {
  fontSize: 10,
  fill: 'grey'
};

class TimeAnalyse extends React.Component {
  state = {
    index: -1
  };

  onPointPress = index => {
    this.setState({
      index
    });
  };

  formatTime = time => {
    const { type } = this.props;
    if (type === 'date') {
      return time.substring(0, 5);
    }
    return time;
  };

  getValueData() {
    const { data } = this.props;
    return data.map(item => item.total);
  }

  renderPoint = () =>
    this.props.data.map((item, index) => (
      <Circle index={index} value={item.total} onPointPress={this.onPointPress} key={index} />
    ));

  renderTooltip = () => {
    const { index } = this.state;
    if (index < 0) return null;
    return <Tooltip value={this.props.data && this.props.data[index] ? this.props.data[index].total : this.props.data.total} index={index} />;
  };

  render() {
    const { containerStyle } = this.props;
    const data = this.getValueData();
    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <Text style={Style.textEmphasize}>Theo thời gian</Text>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <YAxis
            data={data}
            style={{ marginBottom: xAxisHeight }}
            contentInset={verticalContentInset}
            svg={axesSvg}
          />
          <View style={{ flex: 1, marginLeft: 20 }}>
            <LineChart
              style={{ flex: 1 }}
              data={this.getValueData()}
              svg={{
                stroke: 'rgb(134, 65, 244)',
                strokeWidth: 2
              }}
              contentInset={verticalContentInset}
              curve={shape.curveLinear}
            >
              {this.renderPoint()}
              {this.renderTooltip()}
              <Grid />
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, height: xAxisHeight }}
              data={data}
              formatLabel={(value, index) => this.formatTime(this.props.data[index].time)}
              contentInset={{ left: 40, right: 40 }}
              svg={{ fontSize: 10, fill: 'grey' }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1
  }
});

export default TimeAnalyse;
