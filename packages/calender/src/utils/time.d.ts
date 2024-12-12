import dayjs from 'dayjs';
import type { TimeValue, ReturnTimeValue, TimeList } from '@wcalender/types/time';
/**
 * @zh 格式化时间格式
 */
export declare function getReturnTime(time: TimeValue): ReturnTimeValue;
/**
 * @zh 从开始时间到结束时间按间隔时间返回时间列表
 * @param start
 * @param end
 * @param interval
 * @param unit
 */
export declare function getTimes(start: TimeValue, end: TimeValue, interval: number, unit: dayjs.ManipulateType): TimeList;
