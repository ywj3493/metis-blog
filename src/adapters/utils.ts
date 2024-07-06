export function createTypeGuard<T>(...properties: (keyof T)[]) {
  return (dto: any): dto is T => {
    return properties.every((prop) => prop in dto);
  };
}
