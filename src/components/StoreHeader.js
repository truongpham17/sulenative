import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from 'react-redux';
import { setIsSell, setCurrentStore, loadNewStore, loadStore } from '../actions';
import { Style } from '.';

type PropsType = {
  haveExportType?: boolean,
  removeDefaultStore?: boolean
}


class StoreHeader extends React.Component<PropsType> {

  static defaultProps = {
    haveExportType: true,
    removeDefaultStore: false
  }

  renderButton = () => {
    const { isSell, setIsSell } = this.props;
    return (
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
    );
  }

  render() {
    const { stores, setCurrentStore, currentStore } = this.props;
    return (
      <View style={styles.titleContainerStyle}>
        {/* <Text style={[Style.blackEmphasizeTitle, { width: 160 }]}>{'Chọn nguồn hàng'}</Text> */}
        <Dropdown
          label="Chọn nguồn hàng" data={stores.map(item => ({ value: item.name }))}
          containerStyle={{ width: 240 }}
          itemCount={15}
          value={currentStore.name}
          itemTextStyle={Style.normalDarkText}
          selectedItemColor={Style.color.blackBlue}
          onChangeText={(value, index) => setCurrentStore(stores[index].id)}
        />
      {this.props.haveExportType && this.renderButton()}

    </View>

    );
  }
}


export default connect(
  state => ({
    isSell: state.bill.isSell,
    currentStore: state.store.currentStore,
    stores: state.store.stores
  }),
  { setIsSell, setCurrentStore, loadNewStore, loadStore }
)(StoreHeader);

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
    // width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Style.color.white,
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
