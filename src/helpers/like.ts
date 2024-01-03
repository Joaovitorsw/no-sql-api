export function like<T>(value: Partial<T>, propertyName: string) {
  return value?.[propertyName]?.includes('LIKE=')
    ? {
        [propertyName]: {
          $regex: value[propertyName].replace('LIKE=', ''),
          $options: 'i',
        },
      }
    : value;
}
