// 配置项
export interface ScheduleItem {
  start: string;
  end: string;
  type: 'day' | 'time';
}

export type ScheduleData = ScheduleItem[];
