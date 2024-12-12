export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';

export function isUndef(v: any): v is undefined | null {
  return v === undefined || v === null;
}
