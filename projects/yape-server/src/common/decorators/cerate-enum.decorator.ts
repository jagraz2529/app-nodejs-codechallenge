export function createGQLEnumType<T>(enumType: T): { [key: string]: string } {
  const result = {} as { [key: string]: string };
  for (const key in enumType) {
    if (Object.prototype.hasOwnProperty.call(enumType, key)) {
      const value = enumType[key as keyof T] as string;
      result[value] = value;
    }
  }
  return result;
}
