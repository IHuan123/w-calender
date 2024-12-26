import { h } from 'preact';
import type { Rect } from '@wcalender/types/DayView';
import { getTransform, numToPx } from '@/utils/dom';

/**
 * @zh 生成样式
 */
export function genStyles({ x, y, h, w }: Rect): h.JSX.CSSProperties {
  let style = getTransform({
    left: numToPx(x, x as string),
    top: numToPx(y),
    width: numToPx(w, w as string),
    height: numToPx(h),
  }) as h.JSX.CSSProperties;
  return style;
}

// 记录拖拽距离，大于15单位距离才触发事件
export function getMoveDy() {
  let historyDy = 0;
  let getDy: Function | null = (dy: number, threshold: number): number | boolean => {
    historyDy += dy;
    if (Math.abs(historyDy) > threshold) {
      let returnDy = historyDy;
      historyDy = 0;
      return returnDy > 0 ? threshold : -threshold;
    }
    return false;
  };

  return getDy;
}
