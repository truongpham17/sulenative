export function getDate(value) {
  const date = new Date(value);
  return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
}

export function getTwoDigit(value) {
  if (value.toString().length === 1) {
    return `0${value}`;
  }
  return value;
}

export function getReverseDate() {
  const date = new Date();
  return `${date.getFullYear()}-${getTwoDigit(date.getMonth())}-${getTwoDigit(date.getDate())}`;
}

export function getDateFromString(date) {
  try {
    const arr = date.split('-');
    const result = new Date(parseInt(arr[0], 10), parseInt(arr[1], 10) - 1, parseInt(arr[2], 10));
    return result;
  } catch (ex) {
    return new Date();
  }
}
