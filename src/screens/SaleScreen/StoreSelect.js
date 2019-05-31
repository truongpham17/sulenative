import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import {
  setIsSell,
  setCurrentStore,
  loadStoreProduct,
  loadNewStore,
  loadStore
} from '../../actions';
import { Store } from '../../models';
import Loading from '../../components/Loading';
import { Style } from '../../components';

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
  onStoreItemPress = id => {
    const { onStorePress } = this.props;
    if (onStorePress) {
      onStorePress(id);
    }
  };

  keyExtractor = item => item.id;

  handleRefresh = () => {
    const { loadStore } = this.props;
    loadStore();
  };

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
              ? { backgroundColor: Style.color.customGray, borderColor: Style.color.selectedBorder }
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
        data={this.props.store}
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
    const { setIsSell, isSell } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titleContainerStyle}>
          <Text style={Style.blackEmphasizeTitle}>Nguồn hàng</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button
              title="Bán"
              icon={{
                name: 'upload',
                type: 'feather',
                size: 16,
                color: isSell ? Style.color.white : Style.color.lightBlue
              }}
              titleStyle={[
                Style.buttonText,
                { color: isSell ? Style.color.white : Style.color.lightBlue }
              ]}
              type={isSell ? 'solid' : 'outline'}
              buttonStyle={[
                styles.buttonStyle,
                { backgroundColor: isSell ? Style.color.lightBlue : Style.color.white }
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
                color: !isSell ? Style.color.white : Style.color.lightBlue
              }}
              titleStyle={[
                Style.buttonText,
                { color: isSell ? Style.color.lightBlue : Style.color.white }
              ]}
              type={isSell ? 'outline' : 'solid'}
              onPress={() => {
                setIsSell(false);
              }}
              buttonStyle={[
                styles.buttonStyle,
                {
                  backgroundColor: !isSell ? Style.color.lightBlue : Style.color.white,
                  marginLeft: 10
                }
              ]}
            />
          </View>
        </View>
        {this.renderContent()}
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
  { setIsSell, setCurrentStore, loadStoreProduct, loadNewStore, loadStore }
)(StoreSelect);

const styles = StyleSheet.create({
  itemStore: {
    backgroundColor: Style.color.white,
    borderWidth: 2,
    borderColor: Style.color.darkBorder,
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
    borderColor: Style.color.lightBlue,
    borderWidth: 2
  }
});
