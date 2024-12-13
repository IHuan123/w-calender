export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';

export function isUndef(v: any): v is undefined | null {
  return v === undefined || v === null;
}

/**
 * @zh 是否为数组
 */
export const isArray = Array.isArray;
