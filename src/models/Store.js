import { Product, StoreHistory } from '.';

export class Store {
  name;

  id;

  createdAt;

  totalImportProduct;

  productQuantity;

  totalSoldProduct;

  products = [];

  histories = [];

  total = 0;

  totalImport = 0;

  totalFund = 0;

  totalSoldMoney = 0;

  totalLoiNhuan = 0;

  debt = 0;

  isDefault = false;

  static map(data) {
    const store = new Store();
    store.name = data.name;
    store.id = data._id || data.id;
    store.totalImportProduct = data.totalImportProduct;
    store.totalSoldProduct = data.totalSoldProduct;
    store.productQuantity = data.productQuantity;
    store.createdAt = data.createdAt;
    if (data.products) {
      data.products.forEach(item => {
        store.products.push(Product.map(item));
      });
    }
    if (data.histories) {
      data.histories.forEach(item => {
        store.histories.push(StoreHistory.map(item));
      });
    }
    store.total = data.total;
    store.totalImport = data.totalImport;
    store.totalFund = data.totalFund;
    store.totalSoldMoney = data.totalSoldMoney;
    store.totalLoiNhuan = data.totalLoiNhuan;
    store.debt = data.debt;
    store.isDefault = data.isDefault;
    return store;
  }
}
