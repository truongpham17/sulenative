export function search(keyword: string, data: Array<string>) {
  return data.filter(item => item.includes(keyword));
}
