export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';

export function isUndef(v: any): v is undefined | null {
  return v === undefined || v === null;
}

/**
 * @zh 是否为数组
 */
export const isArray = Array.isArray;

/**
 * @zh Object.prototype.toString.call判断数据类型
 */
export function judgType(val: any) {
  let t = Object.prototype.toString.call(val);
  let reg = /^\[(object){1}\s{1}(\w+)\]$/i;
  return t.replace(reg, '$2').toLowerCase();
}

/**
 * @zh 判断对象是否是一个纯粹的对象
 */
export function isObject(obj: any): obj is Object | Array<any> {
  return judgType(obj) === 'object';
}

/**
 * @zh 判断Array/Object为空
 */
export function isEmpty(target: any) {
  return (
    isUndef(target) ||
    (Array.isArray(target) && target.length === 0) ||
    (isObject(target) && Reflect.ownKeys(target).length === 0)
  );
}
