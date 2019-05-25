import { Product, Customer, ProductBill } from '.';

export class Bill {
  productList: Array<ProductBill> = [];

  customer: Customer;

  otherCost: number;

  note: string;

  totalPrice: number;

  totalQuantity: number;

  totalPaid: number;

  createdAt: string;

  createdBy: {};

  id: string;

  paymentStatus: string; // "paid" "debt"

  static map(data: {}): Bill {
    const bill = new Bill();
    bill.id = data._id;
    if (data.productList) {
      data.productList.map(data => bill.productList.push(ProductBill.map2(data)));
    }

    if (data.customer) {
      bill.customer = Customer.map(data.customer);
    }
    if (data.createdBy) {
      bill.createdBy = data.createdBy;
    }

    bill.otherCost = data.otherCost;
    bill.note = data.note;
    bill.totalPrice = data.totalPrice;
    bill.totalQuantity = data.totalQuantity;
    bill.totalPaid = data.totalPaid;
    bill.paymentStatus = data.paymentStatus;
    bill.createdAt = data.createdAt;

    return bill;
  }
}
