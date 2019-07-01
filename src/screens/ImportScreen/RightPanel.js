import React from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native';

import { connect } from 'react-redux';
import { iOSUIKit } from 'react-native-typography';
import { formatPrice } from '../../utils/String';
import { setNote, setDebt, importProduct, setDialogStatus, easeImportData } from '../../actions';
import { AlertInfo } from '../../utils/Dialog';
import { printBill } from '../../utils/Printer';
import { getDatePrinting } from '../../utils/Date';
import { Style, DetailItem, RowTable } from '../../components';
import { SubmitButton } from '../../components/button';

const title = ['Số lượng', 'Giá nhập', 'Giá bán', 'Tổng'];


class Detail extends React.Component {


  onRemove = index => {
    const { removeProductBill } = this.props;
    removeProductBill(index);
  };

  onSubmitImport = () => {
    const { products, note, debt, currentStore, importProduct } = this.props;
    if (currentStore.id.length === 0 || currentStore.isDefault) {
      AlertInfo('Vui lòng chọn nhà cung cấp');
      return;
    }
    if (products.length === 0) {
      AlertInfo('Vui lòng nhập sản phẩm');
      return;
    }
    importProduct({
      storeId: currentStore.id,
      note: `${note} `,
      productList: products,
      debt,
      shoudSaveAsHistory: true
    }, {
        success: () => {
          console.log('print bill success part 1');
          this.showStatusDialog('success');
          this.printBill(products);
          this.props.easeImportData();
        },
        failure: () => this.showStatusDialog('error')
      });
  }

  printBill = (productList) => {
    const { user, currentStore } = this.props;
    console.log('print bill success!!');
    console.log(productList);
    let totalQuantity = 0;
    let totalCost = 0;
    productList.forEach(item => {
      totalQuantity += parseInt(item.quantity, 10);
      totalCost += parseInt(item.importPrice, 10);
    });

    printBill({
      customerName: currentStore.name,
      thungan: user.fullname,
      date: getDatePrinting(),
      productList: productList.map(item => ({
        quantity: item.quantity,
        price: item.importPrice
      })),
      totalQuantity,
      totalCost,
      discount: 0,
      otherCost: 0,
      // eslint-disable-next-line no-mixed-operators
      preCost: totalCost,
      type: 'import'
    });
  }

  showStatusDialog = type => {
    setTimeout(() => {
      this.props.setDialogStatus({
        showDialog: true,
        dialogType: type
      });
    }, 1000);
  };

  keyExtractor = (item, index) => `${index}-${item.exportPrice}-${item.quantity}`;

  renderItem = ({ item, index }) => (
    <DetailItem
      data={item}
      containerStyle={styles.itemStyle}
      textStyle={iOSUIKit.body}
      onRemove={this.onRemove}
      index={index}
      haveSource={false}
      haveImportPrice
    />
  );

  renderTitle(data) {
    return data.map((value, index) => (
      <Text style={[Style.blackTitle, { textAlign: 'center', flex: 1 }]} key={index}>
        {value}
      </Text>
    ));
  }

  renderDetailItem = (title, info) => (
    <RowTable
      itemContainerStyle={{ alignItems: 'flex-start' }}
      flexArray={[2, 1]}
      containerStyle={{ flex: 1 }}
    >
      <Text style={Style.normalDarkText}>{title}</Text>
      <Text style={[Style.textEmphasize, { textAlign: 'right', width: '100%' }]}>
        {info}
      </Text>
    </RowTable>
  );


  renderDetail() {
    const { currentStore, totalQuantity, totalPrice, debt, note, setNote, setDebt } = this.props;
    return (
      <View style={styles.detailContainer}>
        <Text style={styles.textStyle}>Thông tin</Text>
        {this.renderDetailItem('Tổng số lượng nhập: ', `${totalQuantity} cái`)}
        {this.renderDetailItem('Tổng tiền nhập: ', formatPrice(totalPrice))}
        {this.renderDetailItem('Tiền nợ nguồn hàng: ', formatPrice(currentStore.debt))}
        <RowTable flexArray={[0, 1]} itemContainerStyle={{ alignItems: 'flex-end' }} containerStyle={{ flex: 1 }}>
          <Text style={Style.normalDarkText}>Ghi thêm nợ</Text>
          <TextInput
            style={styles.textInputStyle}
            keyboardType="number-pad"
            onChangeText={text => setDebt(text)}
            value={`${debt}`}
            textAlign="right"
          />
        </RowTable>
        <TextInput
          placeholder="Ghi chú"
          style={styles.noteInputStyle}
          onChangeText={text => setNote(text)}
          value={note}
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


  render() {
    const { products } = this.props;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.titleContainerStyle}>{this.renderTitle(title)}</View>
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={{ paddingVertical: 5, paddingHorizontal: 10 }}
            data={products}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        </View>

        {this.renderDetail()}
      </KeyboardAvoidingView>
    );
  }
}
export default connect(
  state => ({
    products: state.importProduct.products,
    currentStore: state.store.currentStore,
    totalQuantity: state.importProduct.totalQuantity,
    totalPrice: state.importProduct.totalPrice,
    debt: state.importProduct.debt,
    note: state.importProduct.note,
    user: state.user.info,
  }), {
    setNote, setDebt, importProduct, setDialogStatus, easeImportData
  }

)(Detail);

const styles = StyleSheet.create({
  itemStyle: {
    height: 80,
    marginTop: 4,
    borderRadius: 8
  },
  textStyle: {
    fontSize: 18,
    textAlign: 'center'
  },
  titleContainerStyle: {
    width: '100%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Style.color.darkBackground,
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 10
  },
  footerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textSumStyle: {
    flex: 1,
    ...Style.normalDarkText,
    textAlign: 'center'
  },
  textEmpStyle: {
    flex: 1,
    ...Style.textEmphasize,
    textAlign: 'center'
  },
  taxStyle: {
    width: 180,
    height: 28,
    flexDirection: 'row'
  },
  textInputStyle: {
    paddingStart: 4,
    ...Style.textEmphasize,
    width: 80,
    // height: 36,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    paddingEnd: 4,
    paddingVertical: 2,
    marginEnd: -4
  },
  submitButtonStyle: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    backgroundColor: Style.color.blackBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerContainerStyle: {
    width: '100%',
    height: 260,
    padding: 10,
    backgroundColor: Style.color.darkBackground,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  noteInputStyle: {
    ...Style.normalDarkText,
    width: '100%',
    height: 44,
    color: Style.color.black,
    borderWidth: 0.5,
    borderColor: Style.color.lightBorder,
    borderRadius: 5,
    backgroundColor: Style.color.background,
    marginTop: 8,
    paddingStart: 8,
    marginBottom: 8
  },
  detailContainer: {
    backgroundColor: Style.color.white,
    borderWidth: 1,
    borderColor: Style.color.lightBorder,
    padding: 8,
    marginBottom: 10,
    height: 300
  },
});
