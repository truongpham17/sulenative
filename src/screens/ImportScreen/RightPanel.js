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
import { SubmitButton } from '../../components/button';
import LOAD_NUMBER from '../../utils/System';

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

// const title = ['STT', 'Giá nhập', 'Giá bán', 'Số lượng', 'Nhập'];

const title = ['Giá nhập', 'Giá bán', 'Số lượng'];

class RightPanel extends React.Component<PropsType, StateType> {
  state = {
    inputProduct: [Product.map({})],
    note: '',
    debt: '0'
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
    if (Math.max(skip, LOAD_NUMBER) >= total) return;
    loadStoreProductImport({
      id: currentStore.id,
      skip: skip === 0 ? LOAD_NUMBER : skip,
      isContinue: true
    });
  };

  onChangeDebt = text => {
    if (text.length === 0) {
      this.setState({ debt: '0' });
      return;
    }
    if (isNaN(text)) {
      return;
    }
    const value = parseInt(text, 10);
    if (value < 0) {
      return;
    }
    this.setState({ debt: `${value}` });
  };

  onSubmitImport = () => {
    const { quantity, validProducts, debt, note } = this.state;
    const { importProduct, currentStore } = this.props;
    let debtAdd = currentStore.debt + parseInt(debt);
    if (isNaN(debtAdd)) {
      debtAdd = currentStore.debt;
    }

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
              productList: validProducts,
              debt: debtAdd
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

  renderDetailItem = (title, info) => (
    <RowTable
      itemContainerStyle={{ alignItems: 'flex-start' }}
      flexArray={[2, 1]}
      containerStyle={{ flex: 1 }}
    >
      <Text style={Style.normalDarkText}>{title}</Text>
      <Text
        style={[
          Style.textEmphasize,
          {
            textAlign: 'right',
            width: '100%'
          }
        ]}
      >
        {info}
      </Text>
    </RowTable>
  );

  renderAction() {
    const { currentStore } = this.props;
    if (currentStore.id.length === 0) {
      return <EmptyStatus label="Vui lòng chọn nguồn hàng" />;
    }
  }

  renderDetail() {
    const { currentStore } = this.props;
    const { quantity, exportPrice, importPrice } = this.state;
    return (
      <View style={styles.detailContainer}>
        <Text style={styles.textStyle}>Thông tin</Text>
        {this.renderDetailItem('Tên nguồn hàng: ', currentStore.name)}
        {this.renderDetailItem('Tổng số lượng nhập: ', `${quantity} cái`)}
        {this.renderDetailItem('Tổng tiền nhập: ', formatPrice(importPrice))}
        {this.renderDetailItem('Tông tiền có thể bán: ', formatPrice(exportPrice))}
        {this.renderDetailItem('Tiền nợ nguồn hàng: ', formatPrice(currentStore.debt))}

        <RowTable flexArray={[0, 1]} itemContainerStyle={{ alignItems: 'flex-end' }}>
          <Text style={Style.normalDarkText}>Ghi thêm nợ</Text>
          <TextInput
            style={styles.textInputStyle}
            keyboardType="number-pad"
            onChangeText={this.onChangeDebt}
            value={this.state.debt}
            textAlign="right"
          />
        </RowTable>
        <TextInput
          placeholder="Ghi chú"
          style={styles.noteInputStyle}
          onChangeText={text => this.setState({ note: text })}
          value={this.state.note}
        />
        <SubmitButton
          title="Xác nhận"
          onPress={this.onSubmitImport}
          buttonStyle={{ width: '100%', marginTop: 10 }}
          textStyle={{ fontSize: 16 }}
        />
      </View>
    );
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
        keyboardDismissMode="on-drag"
      />
    );
  }

  renderTitle() {
    return <Title data={title} />;
  }
  render() {
    const { currentStore } = this.props;

    return (
      <View style={styles.containerStyle}>
        <KeyboardAvoidingView
          style={{
            flex: 3,
            borderWidth: 1,
            borderColor: Style.color.lightBorder,
            marginBottom: 10,
            backgroundColor: Style.color.white,
            marginEnd: 10
          }}
          behavior="padding"
          keyboardVerticalOffset={80}
        >
          {currentStore.id.length === 0 ? this.renderAction() : this.renderContent()}
        </KeyboardAvoidingView>
        <KeyboardAvoidingView
          style={styles.footerStyle}
          behavior="padding"
          keyboardVerticalOffset={-80}
        >
          {this.renderDetail()}
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
  containerStyle: {
    flex: 7,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    marginStart: 0,
    backgroundColor: Style.color.darkBackground,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  titleContainerStyle: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  detailContainer: {
    flex: 1,
    backgroundColor: Style.color.white,
    borderWidth: 1,
    borderColor: Style.color.lightBorder,
    padding: 8,
    marginBottom: 10,
    maxHeight: '70%'
  },
  footerStyle: {
    flex: 2
  },
  buttonStyle: {
    borderRadius: 8,
    width: 120,
    height: 48,
    backgroundColor: Style.color.blackBlue
  },
  textStyle: {
    ...Style.blackTitle,
    textAlign: 'center',
    width: '100%'
  },
  textInputStyle: {
    ...Style.normalDarkText,
    width: 80,
    height: 36,
    color: Style.color.black,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    textAlign: 'center',
    paddingEnd: 8
  },
  noteInputStyle: {
    ...Style.normalDarkText,
    width: '100%',
    height: 48,
    color: Style.color.black,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    marginTop: 8,
    paddingStart: 8
  }
});
