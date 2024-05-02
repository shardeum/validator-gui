export function replacer(key: string, value: unknown) {
  if (typeof value === 'bigint') {
    return value.toString();
  } else {
    return value;
  }
}
