import { isUndef } from './is';
/**
 * 添加单位
 */
export function addUnit(n: number, unit: string) {
  return n + unit;
}

// 转36进制
export function numTo36(n = new Date().valueOf()) {
  return n.toString(36);
}
/**
 * 创建一个唯一ID
 */
export function createUniqueId(n?: number) {
  if (isUndef(n)) n = new Date().valueOf();
  return numTo36(n) + Math.random().toString(36).substring(2);
}

/**
 * 深克隆
 * @param { Object, Array<Object> } target 目标数据
 */
export function deepClone<T>(target: T): T {
  if (isUndef(target) || typeof target !== 'object') {
    return target; // 基本类型直接返回
  }

  const targetObj: any = Array.isArray(target) ? [] : {};

  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      target[key] = deepClone(target[key]);
    }
  }

  return targetObj;
}
