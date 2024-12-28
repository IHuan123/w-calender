import { ReturnTimeValue } from './time';
export type DateRange = [ReturnTimeValue, ReturnTimeValue];
export type timeType = 'day' | 'time';
// 配置项
export interface ScheduleItem {
  start: string;
  end: string;
  type: timeType;
  title: string;
  [prop: string]: any;
}

export type ScheduleData = ScheduleItem[];
