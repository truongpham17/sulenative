export class Customer {
  name: string;

  phone: string;

  address: string;

  static map(data: {}): Customer {
    const customer = new Customer();
    customer.name = data.name;
    customer.address = data.address;
    customer.phone = data.phone;
    return customer;
  }
}
