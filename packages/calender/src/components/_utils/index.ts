import { h } from 'preact';
import type { Rect } from '@wcalender/types/components';
import type { DateRange } from '@/types/schedule';
import { getTransform, numToPx, getTimes } from '@/utils';
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
/**
 * @zh 获取时间列表
 */
export function getTimeList(date: DateRange, interval: number) {
  if (!date) {
    return [];
  }
  const [start, end] = date;
  const startTime = start.time.startOf('day'),
    endTime = end.time.endOf('day');
  return getTimes(startTime, endTime, interval, 'minute');
}
