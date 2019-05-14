import { Store, Product } from '.';

export class StoreHistory {
  date: number;

  store: Store;

  quantity: number;

  total: number;

  note: string;

  products: Product[] = [];

  static map(data: {}) {
    const storeHistory = new StoreHistory();
    storeHistory.date = data.date;
    if (data.store) {
      storeHistory.store = Store.map(data.store);
    }
    if (data.products) {
      data.products.forEach(item => {
        storeHistory.products.push(Product.map(item));
      });
    }
    storeHistory.quantity = data.quantity;
    storeHistory.total = data.total;
    storeHistory.note = data.note;
    return storeHistory;
  }
}
