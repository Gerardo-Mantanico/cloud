export const setDefault = (defaultValue) => (value) => {
  if (value === undefined) return defaultValue
  return value
}
