import dayjs from 'dayjs';
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
  if (typeof time === 'string') {
    time = dayjs(time);
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
    data.push({ time: startTime });
    startTime = getReturnTime(startTime.time.add(interval, unit));
  }

  return data;
}
