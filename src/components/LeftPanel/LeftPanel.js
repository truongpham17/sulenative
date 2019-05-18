import React from 'react';
import { iOSUIKit } from 'react-native-typography';
import { View, StyleSheet, FlatList, Text } from 'react-native';

import { Button, SearchBar } from 'react-native-elements';
import Item from './Item';
import Style from '../Style';

type dataType = {
  name: string,
  date: string,
  info1: string,
  info2: string,
  id: string
};

type PropsType = {
  data: Array<dataType>,
  footer: any,
  containerStyle: {},
  title: string,
  onPress: () => null,
  onLongPress: () => null,
  activeId?: string,
  haveSearch?: boolean
};

export default class LeftPanel extends React.Component<PropsType> {
  static defaultProps = { activeId: '', haveSearch: false };
  state = {
    keyword: '',
    search: ''
  };

  onEndReached = () => {
    const { onEndReached } = this.props;
    if (onEndReached) {
      onEndReached();
    }
  };

  onClear = () => {
    const { onClear } = this.props;
    if (onClear) {
      onClear();
    }
  };

  onChangeText = search => {
    this.setState({ search });
  };

  onSubmitSearch = () => {
    const { onSubmitSearch } = this.props;
    const { search } = this.state;
    // if()
    // check if this is not number -> search by name
    if (!isNaN(search) && search.length <= 5) {
      if (onSubmitSearch) {
        onSubmitSearch('0'.repeat(5 - search.length) + search);
      }
    } else {
      onSubmitSearch(search, true);
    }
  };

  getData = () => {
    const { data } = this.props;
    const { keyword } = this.state;

    return data.filter(item => item.name.toLowerCase().includes(keyword.trim().toLowerCase()));
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <Item
      {...item}
      key={item.id}
      onPress={() => this.props.onPress(item.id)}
      onLongPress={() => this.props.onLongPress(item.id)}
      isActive={item.id === this.props.activeId}
    />
  );

  renderHeader = () =>
    this.props.haveSearch && (
      <SearchBar
        platform="ios"
        containerStyle={{ marginHorizontal: -10, height: 48 }}
        inputContainerStyle={{ height: 30, margin: 10 }}
        onChangeText={this.onChangeText}
        onClear={this.onClear}
        value={this.state.search}
        placeholder="Nhập ID hoặc tên KH"
        inputStyle={Style.normalDarkText}
        onSubmitEditing={this.onSubmitSearch}
      />
    );

  render() {
    const {
      footer,
      containerStyle,
      title,
      onEndReached,
      refreshing,
      onRefresh,
      onAddStore
    } = this.props;
    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <View style={styles.titleContainerStyle}>
          <Text style={[Style.blackEmphasizeTitle]}>{title}</Text>
          {onAddStore && (
            <Button
              title="+ Thêm mới"
              titleStyle={[Style.buttonText]}
              type={'solid'}
              buttonStyle={[styles.buttonStyle]}
              onPress={onAddStore}
            />
          )}
        </View>
        <FlatList
          ListHeaderComponent={this.renderHeader}
          renderItem={this.renderItem}
          data={this.getData()}
          keyExtractor={this.keyExtractor}
          ListFooterComponent={footer}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          style={styles.contentStyle}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainerStyle: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Style.color.darkBackground,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  contentStyle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 1
  },
  buttonStyle: {
    height: 44,
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.color.lightBlue
  }
});
