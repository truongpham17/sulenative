import { Store } from '.';

export class Product {
  importPrice: number;

  exportPrice: number;

  quantity: number;

  total: number;

  store: Store;

  isReturned: boolean;

  id: string;

  soldQuantity: number;

  capitalAmount: number;

  static map(data: {}): Product {
    const product = new Product();
    product.id = data.id || data._id;
    product.importPrice = data.importPrice || 0;
    product.exportPrice = data.exportPrice || 0;
    product.quantity = data.quantity || 0;
    product.soldQuantity = data.soldQuantity || 0;
    product.capitalAmount = data.capitalAmount || 0;
    product.total = data.total;
    if (data.store) {
      product.store = Store.map(data.store);
    }
    if (data.isReturned) {
      product.isReturned = data.isReturned;
    } else {
      product.isReturned = false;
    }
    return product;
  }

  static mapWithoutQuantity(data: {}): Product {
    const product = new Product();
    product.id = data.id || data._id;
    product.importPrice = data.importPrice || 0;
    product.exportPrice = data.exportPrice || 0;
    product.quantity = 0;
    product.soldQuantity = data.soldQuantity || 0;
    product.capitalAmount = data.capitalAmount || 0;
    product.total = data.total;
    if (data.store) {
      product.store = Store.map(data.store);
    }
    if (data.isReturned) {
      product.isReturned = data.isReturned;
    } else {
      product.isReturned = false;
    }
    return product;
  }
}
