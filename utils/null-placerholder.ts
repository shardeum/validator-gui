export function nullPlaceholder(value: string | number | null, placeholder = '-') {
  return value != null ? value : placeholder;
}
