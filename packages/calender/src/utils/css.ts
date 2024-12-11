export const CSS_PREFIX = 'w-calender';

/**
 * @zh 为className添加统一前缀
 * @en
 * @param {string} classNames
 * @returns
 */
export function cls(classNames: string | Array<string | undefined>) {
  const getCls = (name: string) => {
    if (name.startsWith(CSS_PREFIX)) {
      return name;
    }
    return `${CSS_PREFIX}-${name}`;
  };
  if (typeof classNames === 'string') {
    return getCls(classNames);
  }
  return classNames.reduce((prev, cur, index) => {
    if (cur === undefined) {
      return prev;
    }
    let className = getCls(cur);
    if (index === 0) {
      return className;
    }
    return prev + ` ${className}`;
  }, '');
}
