export function formatPrice(value) {
  if (!value) {
    return value;
  }
  if (value === 0 || value === '0') {
    return '$ 0';
  }
  let price = value.toString();
  const index = price.indexOf('-');

  if (price.length > 3 && index === -1) {
    price = `${price.slice(0, price.length - 3)}.${price.slice(price.length - 3)}`;
  } else if (price.length > 4 && index > -1) {
    price = `-${price.slice(1, price.length - 3)}.${price.slice(price.length - 3)}`;
  }
  return `$ ${price}`;
}
