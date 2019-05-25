export function AcceptNumber(value) {
  if (!value || isNaN(value) || value.length === 0) {
    return '0';
  }
  return `${parseInt(value, 10)}`;
}
