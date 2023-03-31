export function nullPlaceholder(value: string | number | null, placeholder = '-') {
  return value ? value : placeholder;
}
