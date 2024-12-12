// 配置项
export interface ScheduleOption {
  start: string;
  end: string;
  type: 'day' | 'time';
}

export type ScheduleData = ScheduleOption[];
