import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  AlertIOS,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { loadStoreProductImport } from '../../actions';
import RowTable from '../../components/RowTable';
import ImportItem from './components/ImportItem';
import { formatPrice } from '../../utils/String';
import { Title, EmptyStatus, Style } from '../../components';
import { Product, Store } from '../../models';
import { ActionButton } from '../../components/button';

type StateType = {
  inputProduct: Array<Product>,
  note: string,
  quantity: 0,
  exportPrice: 0,
  importPrice: 0,
  validProducts: []
};

type PropsType = {
  currentStore: Store,
  importProduct: () => null
};

const title = ['STT', 'Giá nhập', 'Giá bán', 'Số lượng', 'Nhập'];

class RightPanel extends React.Component<PropsType, StateType> {
  state = {
    inputProduct: [Product.map({})],
    note: ''
  };

  componentWillReceiveProps(nextProps) {
    const { products } = this.props;
    const { inputProduct } = this.state;
    if (!nextProps.products || !products) return;
    if (nextProps.removeAll) {
      this.setState({
        inputProduct: [Product.map({})]
      });
    } else if (nextProps.products !== products) {
      const currentInputProduct = inputProduct.filter(item => this.isValidate(item));
      const filterProducts = nextProps.products.filter(
        item => !item.isReturned && !this.checkDuplicate(item, currentInputProduct)
      );
      this.setState(
        {
          inputProduct: [Product.map({}), ...currentInputProduct, ...filterProducts]
        },
        () => this.getInfos()
      );
    }
  }

  onSubmitItem = isNew => {
    if (isNew) {
      this.setState(
        state => ({
          inputProduct: [Product.map({}), ...state.inputProduct]
        }),
        () => this.getInfos()
      );
    } else {
      this.getInfos();
    }
  };

  onChange = (idx, value, type) => {
    this.setState(state => ({
      inputProduct: state.inputProduct.map((item, index) => {
        if (index === idx) {
          return {
            ...item,
            [type]: value
          };
        }
        return item;
      })
    }));
  };

  onRemove = idx => {
    this.setState(
      state => ({
        inputProduct: state.inputProduct.filter((item, index) => index !== idx)
      }),
      () => this.getInfos()
    );
  };

  onNoteChange = note => {
    this.setState({
      note
    });
  };

  onDeleteState = () => {
    const { loadStoreProductImport, currentStore } = this.props;
    this.setState(
      {
        inputProduct: [Product.map({})],
        note: ''
      },
      () => loadStoreProductImport({ id: currentStore.id, skip: 0 })
    );
  };

  onEndReached = () => {
    const { loadStoreProductImport, currentStore, skip, total } = this.props;
    if (Math.max(skip, 20) >= total) return;
    loadStoreProductImport({ id: currentStore.id, skip: skip === 0 ? 20 : skip, isContinue: true });
  };

  onSubmitImport = () => {
    const { quantity, validProducts } = this.state;
    const { note } = this.state;
    const { importProduct, currentStore } = this.props;
    if (quantity === undefined || quantity === 0) {
      AlertIOS.alert('Vui lòng nhập sản phẩm');
      return;
    }
    if (currentStore.id.length === 0) {
      AlertIOS.alert('Yêu cầu', 'Vui lòng chọn nhà cung cấp');
      return;
    }
    AlertIOS.alert('Xác nhận?', `Thêm ${quantity} sản phẩm vào nhà cung cấp ${currentStore.name}`, [
      {
        text: 'Huỷ',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: 'Thêm',
        onPress: () =>
          importProduct(
            {
              storeId: currentStore.id,
              note: `${note} `,
              productList: validProducts
            },
            {
              success: () => {
                AlertIOS.alert('Thêm sản phẩm thành công!!');
                this.onDeleteState();
              },
              failure: () => AlertIOS.alert('Nhập sản phẩm thất bại, vui lòng thử lại!')
            }
          )
      }
    ]);
  };

  getInfos() {
    const { inputProduct } = this.state;
    const validProducts = inputProduct
      .filter((item, index) => this.isValidate(item) && index > 0)
      .map(item => ({
        quantity: item.quantity,
        importPrice: item.importPrice,
        exportPrice: item.exportPrice
      }));
    let quantity = 0;
    let exportPrice = 0;
    let importPrice = 0;
    validProducts.map(item => {
      quantity += parseInt(item.quantity, 10);
      exportPrice += parseInt(item.exportPrice, 10) * parseInt(item.quantity, 10);
      importPrice += parseInt(item.importPrice, 10) * parseInt(item.quantity, 10);
    });
    this.setState({
      quantity,
      exportPrice,
      importPrice,
      validProducts
    });
  }

  checkDuplicate(item, list) {
    let result = false;
    list.some(i => {
      if (item.id === i.id) {
        result = true;
        return true;
      }
      return false;
    });
    return result;
  }

  isValidate(data) {
    if (
      !data.quantity ||
      parseInt(data.quantity, 10) === 0 ||
      !data.importPrice ||
      parseInt(data.importPrice, 10) === 0 ||
      !data.exportPrice
    ) {
      return false;
    }
    if (parseInt(data.importPrice, 10) > parseInt(data.exportPrice, 10)) {
      return false;
    }
    return true;
  }

  keyExtractor = (item, index) => item.id || `${index} `;

  renderItem = ({ item, index }) => (
    <ImportItem
      index={index}
      onSubmit={this.onSubmitItem}
      isFocus={index === 0}
      data={item}
      onChange={this.onChange}
      onRemove={this.onRemove}
    />
  );

  renderFooter = () => {
    const { quantity, exportPrice, importPrice } = this.state;
    const { note } = this.state;
    return (
      <RowTable
        containerStyle={{
          backgroundColor: Style.color.background,
          width: undefined,
          height: 48,
          marginBottom: 5
        }}
      >
        <Text style={Style.blackTitle}>Tổng cộng </Text>
        <Text style={Style.blackTitle}>{formatPrice(importPrice)}</Text>
        <Text style={Style.blackTitle}>{formatPrice(exportPrice)}</Text>
        <Text style={Style.blackTitle}>{quantity} cái</Text>
        <TextInput
          style={[Style.normalDarkText, { width: 120, height: '100%' }]}
          placeholder="Ghi chú..."
          onChangeText={text => this.onNoteChange(text)}
          value={note}
        />
      </RowTable>
    );
  };

  renderAction() {
    const { currentStore } = this.props;
    if (currentStore.id.length === 0) {
      return <EmptyStatus label="Vui lòng chọn nguồn hàng" />;
    }
  }

  renderContent() {
    const { inputProduct } = this.state;
    const { products } = this.props;
    return (
      <FlatList
        data={inputProduct}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ListHeaderComponent={this.renderTitle()}
        onEndReachedThreshold={0.5}
        onEndReached={this.onEndReached}
        extraData={products}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  renderTitle() {
    return <Title data={title} />;
  }
  render() {
    const { currentStore } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: Style.color.darkBackground }}>
        <View style={styles.titleContainerStyle}>
          <Text style={Style.blackEmphasizeTitle}>Thông tin sản phẩm</Text>
        </View>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: Style.color.white,
            paddingVertical: 5,
            paddingHorizontal: 10
          }}
          behavior="padding"
        >
          {currentStore.id.length === 0 ? this.renderAction() : this.renderContent()}
          {this.renderFooter()}

          <View style={styles.footerStyle}>
            <ActionButton title="Xác nhận" onPress={this.onSubmitImport} />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default connect(
  state => ({
    products: state.importProduct.products,
    currentStore: state.store.currentStore,
    skip: state.importProduct.skip,
    total: state.importProduct.total,
    removeAll: state.importProduct.removeAll
  }),
  { loadStoreProductImport }
)(RightPanel);

const styles = StyleSheet.create({
  titleContainerStyle: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  footerStyle: {
    width: '100%',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonStyle: {
    borderRadius: 8,
    width: 120,
    height: 48,
    backgroundColor: Style.color.blackBlue
  }
});
