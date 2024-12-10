export const CSS_PREFIX = 'ch-calender';

/**
 * @zh 为className添加统一前缀
 * @en
 * @param {string} classNames
 * @returns
 */
export function cls(classNames: string | string[]) {
  const getCls = (name: string) => `${CSS_PREFIX}-${name}`;
  if (typeof classNames === 'string') {
    return getCls(classNames);
  }
  return classNames.reduce((prev, cur, index) => {
    let className = getCls(cur);
    if (index === 0) {
      return className;
    }
    return prev + ` ${className}`;
  }, '');
}
