import dayjs, { UnitType } from 'dayjs';
import type { TimeValue, ReturnTimeValue, TimeList } from '@wcalender/types/time';
import { isDate } from '@/utils/is';

import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(quarterOfYear);
dayjs.extend(isBetween);

export const RETURN_TIME_KEY = Symbol('returnTimeKey');
/**
 * @zh 格式化时间格式
 */
// 时间格式
export function getReturnTime(time: TimeValue): ReturnTimeValue {
  if (dayjs.isDayjs(time)) {
    // 这里是防止外部没有引入quarterOfYear导致quarter not function的问题
    time = dayjs(time.format('YYYY-MM-DD HH:mm:ss'));
  }
  if (typeof time === 'string' || isDate(time)) {
    time = dayjs(time);
  }

  if (isReturnTime(time)) {
    time = time.time;
  }

  if (!time.isValid()) {
    throw new Error('The time parameter must be a valid time type！');
  }
  let res = {
    year: time.year(),
    month: time.month() + 1, // 月返回的是0～11
    date: time.date(),
    day: time.day(), // 从0(星期天)到6(星期六)
    time,
    quarter: time.quarter(),
    hour: time.hour(),
    minute: time.minute(),
    second: time.second(),
    afternoon: time.isSameOrAfter(dayjs(`${time.format('YYYY-MM-DD')} 12:00:00`)),
    [RETURN_TIME_KEY]: true,
  };

  return res;
}

/**
 * @zh 从开始时间到结束时间按间隔时间返回时间列表
 * @param start
 * @param end
 * @param interval
 * @param unit
 */
export function getTimes(
  start: TimeValue,
  end: TimeValue,
  interval: number,
  unit: dayjs.ManipulateType
) {
  let startTime = getReturnTime(start);
  let endTime = getReturnTime(end);
  let data: TimeList = [];

  while (endTime.time.isAfter(startTime.time)) {
    let nextTime = getReturnTime(startTime.time.add(interval, unit));
    let config = { start: startTime, end: nextTime };
    data.push(config);
    startTime = nextTime;
  }

  return data;
}

/**
 * @zh 通过一个时间获取该时间的开始时间和结束时间
 */
export function getTimeStartAndEnd(
  time: TimeValue,
  type: UnitType
): [ReturnTimeValue, ReturnTimeValue] | never {
  let timeValue = getReturnTime(time);
  if (!timeValue.time.isValid()) {
    throw new Error('The time parameter must be a valid time type！');
  }
  let start = timeValue.time.startOf(type);
  let end = timeValue.time.endOf(type);
  return [getReturnTime(start), getReturnTime(end)];
}

/**
 * @zh 判断两个时间段是否存在交叉
 */
export function isCrossoverTime(o: [TimeValue, TimeValue], t: [TimeValue, TimeValue]): boolean {
  return !(
    getReturnTime(o[0]).time.isSameOrAfter(getReturnTime(t[1]).time) ||
    getReturnTime(o[1]).time.isSameOrBefore(getReturnTime(t[0]).time)
  );
}

/**
 * @zh 判断这个时间段是否在另一个时间段内
 */
export function isContainTimeRange(
  o: [TimeValue, TimeValue],
  range: [TimeValue, TimeValue],
  c?: UnitType,
  d?: '()' | '[]' | '[)' | '(]'
) {
  return isTimeBetween(o[0], range, c, d) && isTimeBetween(o[1], range, c, d);
}

/**
 * @zh 时间格式化
 * @en date format
 * @param time
 * @param template
 * @returns
 */
export function format(time: ReturnTimeValue, template: string) {
  return time.time.format(template);
}

/**
 * 判断是否为ReturnTimeValue
 */
export function isReturnTime(value: any): value is ReturnTimeValue {
  return !!value?.[RETURN_TIME_KEY];
}

/**
 * @zh 给定一个时间和一个时间范围，判断该时间是否在这个事件范围内
 */
export function isTimeBetween(
  time: TimeValue,
  [start, end]: [TimeValue, TimeValue],
  c?: UnitType,
  d?: '()' | '[]' | '[)' | '(]'
) {
  return getReturnTime(time).time.isBetween(
    getReturnTime(start).time,
    getReturnTime(end).time,
    c,
    d
  );
}
