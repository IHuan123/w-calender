import dayjs, { UnitType } from 'dayjs';
import type { TimeValue, ReturnTimeValue, TimeList } from '@wcalender/types/time';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
dayjs.extend(quarterOfYear);
/**
 * @zh 格式化时间格式
 */
// 时间格式
export function getReturnTime(time: TimeValue): ReturnTimeValue {
  if (dayjs.isDayjs(time)) {
    // 这里是防止外部没有引入quarterOfYear导致quarter not function的问题
    time = dayjs(time.format('YYYY-MM-DD HH:mm:ss'));
  }
  if (typeof time === 'string') {
    time = dayjs(time);
  }

  if (!time.isValid()) {
    throw new Error('The time parameter must be a valid time type！');
  }
  return {
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
  };
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
  time = dayjs(time);
  if (!time.isValid()) {
    throw new Error('The time parameter must be a valid time type！');
  }
  let start = time.startOf(type);
  let end = time.endOf(type);
  return [getReturnTime(start), getReturnTime(end)];
}

/**
 * @zh 判断两个时间段是否存在交叉
 */

export function isCrossoverTime(
  o: [ReturnTimeValue, ReturnTimeValue],
  t: [ReturnTimeValue, ReturnTimeValue]
): boolean {
  return !(o[0].time.isAfter(t[1].time) || o[1].time.isBefore(t[0].time));
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
