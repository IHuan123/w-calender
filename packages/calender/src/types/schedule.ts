import { TimeValue } from './time';
export type DateRange = [TimeValue, TimeValue];
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
