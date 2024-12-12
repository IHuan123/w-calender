/**
 * 获取px
 */
export declare function numToPx(n?: string | number): string;
/**
 * 判断是否为HTML元素
 */
export declare function isElement(el: any): el is HTMLElement;
/**
 * 获取html元素
 */
export declare function getElement(el: string | HTMLElement): HTMLElement | Element | null;
/**
 * @desc 设置元素属性setAttribute
 */
export declare function setAttributes(el: HTMLElement, attrs: {
    [prop: string]: string;
}): void;
/**
 * @desc 设置style属性
 */
export declare function setElementStyle(el: HTMLElement, styles: Partial<CSSStyleDeclaration>): void;
export declare function getTransform(config: Partial<Record<'left' | 'top' | 'width' | 'height', string>>): Partial<CSSStyleDeclaration>;
/**
 * @zh 解析transform x y
 */
export declare function parseTranslateXY(transform: string): {
    x: number;
    y: number;
};
/**
 * @desc 获取transform translate3d的值
 */
export declare function getAttrsTransformTranslate(el: HTMLElement): {
    x: number;
    y: number;
};
