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
