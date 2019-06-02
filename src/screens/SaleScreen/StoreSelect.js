import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Button, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import {
  setIsSell,
  setCurrentStore,
  loadNewStore,
  loadStore
} from '../../actions';
import { Store } from '../../models';
import Loading from '../../components/Loading';
import { Style } from '../../components';
import PriceSelect from './PriceSelect';

type PropsType = {
  stores: Array<Store>,
  isSell: boolean,
  setIsSell: () => null,
  setCurrentStore: (id: string) => null,
  currentStore: Store,
  loadStoreProduct: (id: string) => Promise,
  loadStore: () => Promise
};

class StoreSelect extends React.Component<PropsType> {

  state = {
    zIndex: 3,
    search: '',
    priceSearch: '',
    storeSearch: ''
  }
  onStoreItemPress = id => {
    const { onStorePress } = this.props;
    this.setState({ zIndex: 1 });
    if (onStorePress) {
      onStorePress(id);
    }
  };

  keyExtractor = item => item.id;

  handleRefresh = () => {
    const { loadStore } = this.props;
    loadStore();
  };

  onSubmitEditing = () => {
    const { search, zIndex } = this.state;
    if (zIndex === 1) {
      this.setState({
        priceSearch: search
      });
    } else {
      this.setState({
        storeSearch: search
      });
    }
  }

  getData = () => {
    const { storeSearch } = this.state;
    const { store } = this.props;
    if (!storeSearch) {
      return store;
    }
    return store.filter(item => item.name && item.name.toLowerCase().includes(storeSearch.toLowerCase()));
  }


  renderSearchBar = () => (
    <View style={{ width: 240 }}>
      <SearchBar
        platform="ios"
        inputContainerStyle={{ height: 30 }}
        onChangeText={search => this.setState({ search })}
        onClear={() => this.setState({ search: '', storeSearch: '', priceSearch: '' })}
        value={this.state.search}
        placeholder={this.state.zIndex === 3 ? 'Tên nguồn hàng' : 'Giá bán: '}
        inputStyle={Style.normalDarkText}
        onSubmitEditing={this.onSubmitEditing}
      />
    </View>
  );

  renderStoreItem = ({ item }) => {
    const { currentStore } = this.props;
    return (
      <View style={{ flex: 1, height: 100, padding: 5 }}>
        <Button
          key={item.id}
          title={item.name}
          buttonStyle={[
            styles.itemStore,
            item.id === currentStore.id
              ? { borderColor: Style.color.selectedBorder }
              : {}
          ]}
          titleStyle={[Style.textEmphasize, { fontWeight: '600' }]}
          onPress={() => this.onStoreItemPress(item.id)}
        />
      </View>
    );
  };

  renderContent() {
    const { loading, firstLoading } = this.props;
    if (loading && firstLoading) {
      return <Loading lineNum={12} />;
    }
    return (
      <FlatList
        style={styles.storeContainer}
        data={this.getData()}
        renderItem={this.renderStoreItem}
        keyExtractor={item => item.id}
        numColumns={3}
        extraData={this.props}
        columnWrapperStyle={{ marginBottom: 10 }}
        refreshing={loading}
        onRefresh={this.handleRefresh}
      />
    );
  }

  render() {
    const { setIsSell, isSell, currentStore } = this.props;
    return (
      <View style={styles.storeViewContainer}>
        <View style={styles.titleContainerStyle}>
          <Text style={[Style.blackEmphasizeTitle, { width: 160 }]}>{this.state.zIndex === 1 ? `${currentStore.name}` : 'Chọn nguồn hàng'}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button
              title="Bán"
              icon={{
                name: 'upload',
                type: 'feather',
                size: 16,
                color: isSell ? Style.color.white : Style.color.blackBlue
              }}
              titleStyle={[
                Style.buttonText,
                { color: isSell ? Style.color.white : Style.color.blackBlue }
              ]}
              type={isSell ? 'solid' : 'outline'}
              buttonStyle={[
                styles.buttonStyle,
                { backgroundColor: isSell ? Style.color.blackBlue : Style.color.white }
              ]}
              onPress={() => {
                setIsSell(true);
              }}
            />
            <Button
              title="Trả"
              icon={{
                name: 'download',
                type: 'feather',
                size: 16,
                color: !isSell ? Style.color.white : Style.color.blackBlue
              }}
              titleStyle={[
                Style.buttonText,
                { color: isSell ? Style.color.blackBlue : Style.color.white }
              ]}
              type={isSell ? 'outline' : 'solid'}
              onPress={() => {
                setIsSell(false);
              }}
              buttonStyle={[
                styles.buttonStyle,
                {
                  backgroundColor: !isSell ? Style.color.blackBlue : Style.color.white,
                  marginLeft: 10
                }
              ]}
            />
          </View>
          {this.renderSearchBar()}

        </View>

        <View style={{ flex: 1 }}>
          <View style={{ zIndex: this.state.zIndex, backgroundColor: Style.color.white, flex: 1 }}>
          {this.renderContent()}
          </View>
           <View style={styles.priceContainer}>
            <PriceSelect onSubmit={() => this.setState({ zIndex: 3, priceSearch: '' })} search={this.state.priceSearch} />
          </View>
        </View>


      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSell: state.bill.isSell,
    store: state.store.stores,
    currentStore: state.store.currentStore,
    loading: state.store.loadingStore,
    firstLoading: state.store.firstLoading
  };
}

export default connect(
  mapStateToProps,
  { setIsSell, setCurrentStore, loadNewStore, loadStore }
)(StoreSelect);

const styles = StyleSheet.create({
  priceContainer: {
    flex: 1,
    position: 'absolute',
    zIndex: 2,
    backgroundColor: Style.color.white,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  storeViewContainer: {
    flex: 6,
    backgroundColor: Style.color.white,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  itemStore: {
    backgroundColor: Style.color.background,
    borderWidth: 2,
    borderColor: Style.color.background,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  storeContainer: {
    flex: 1,
    width: '100%',
    padding: 5
  },
  titleContainerStyle: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Style.color.darkBackground,
    flexDirection: 'row'
  },
  buttonStyle: {
    height: 44,
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Style.color.blackBlue,
    borderWidth: 2
  }
});
