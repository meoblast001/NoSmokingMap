export function isArrayOf<TInner>(x: any, innerGuard: (y: any) => y is TInner): x is TInner[] {
  return Array.isArray(x) && x.every(innerGuard);
}
