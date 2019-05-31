export function formatPrice(value) {
  if (!value) {
    return '0 VND';
  }
  if (value === 0 || value === '0') {
    return '0 VND';
  }
  let price = value.toString();
  const index = price.indexOf('-');

  if (price.length > 3 && index === -1) {
    const kValue = parseInt(price.slice(price.length - 3), 10);
    if (kValue === 0) {
      price = `${price.slice(0, price.length - 3)} Triệu `;
    } else {
      price = `${price.slice(0, price.length - 3)}Tr ${kValue}K`;
    }
  } else if (price.length > 4 && index > -1) {
    const kValue = parseInt(price.slice(price.length - 3), 10);

    if (kValue === 0) {
      price = `${price.slice(1, price.length - 3)} Triệu `;
    } else {
      price = `-${price.slice(1, price.length - 3)}Tr  ${kValue}K`;
    }
  } else {
    price = `${price}K`;
  }
  return price;
}
