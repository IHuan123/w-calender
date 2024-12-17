import { defaultWindow } from '../constant/_configurable';
export const isSupportedResizeObserver = defaultWindow && 'ResizeObserver' in defaultWindow;
/**
 * @zh 监听元素尺寸变化
 * @ch Listens for changes in the size of the element
 */
export function elementResizeObserver(
  target: HTMLElement,
  callback: (config: { width: number; height: number }) => void,
  options: {
    box: ResizeObserverBoxOptions;
  } = { box: 'border-box' }
) {
  if (!isSupportedResizeObserver) {
    throw new Error('The current environment does not support ResizeObserver！');
  }
  // box mode
  const { box = 'content-box' } = options;
  let resizeObserver: ResizeObserver | null | undefined;
  // Is it an SVG element
  const isSVG = target.namespaceURI?.includes('svg');
  resizeObserver = new ResizeObserver(([entry]) => {
    let width = 0,
      height = 0;
    const boxSize =
      box === 'border-box'
        ? entry.borderBoxSize
        : box === 'content-box'
          ? entry.contentBoxSize
          : entry.devicePixelContentBoxSize;

    if (defaultWindow && isSVG) {
      const $elem = target;
      if ($elem) {
        const rect = $elem.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }
    } else {
      if (boxSize) {
        const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
        width = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
        height = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
      } else {
        // fallback
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
    }
    callback({ width, height });
  });
  resizeObserver.observe(target);
  return {
    resizeObserver,
    observe: resizeObserver.observe,
    unobserve() {
      if (resizeObserver) resizeObserver.unobserve(target);
    },
    disconnect() {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    },
  };
}
