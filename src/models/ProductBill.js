import { Product, Store } from '.';

export class ProductBill {
  product: Product = null;

  soldQuantity: number = 0;

  paybackQuantity: number = 0;

  discount: number = 0;

  id: string;

  static map(data: {}): ProductBill {
    const productBill = new ProductBill();
    if (data.product) {
      productBill.product = Product.map(data.product);
    }
    productBill.soldQuantity = data.soldQuantity || 0;
    productBill.paybackQuantity = data.paybackQuantity || 0;
    productBill.discount = data.discount || 0;
    productBill.id = data.id;
    return productBill;
  }

  setStore(store: Store) {
    this.product.store = store;
  }

  static map2(data: {}): ProductBill {
    const productBill = new ProductBill();
    if (data.product) {
      productBill.product = Product.map(data.product);
    }
    if (data.isReturned) {
      productBill.paybackQuantity = data.quantity;
    } else {
      productBill.soldQuantity = data.quantity;
    }
    productBill.discount = data.discount || 0;
    productBill.id = data.id;
    return productBill;
  }
}
