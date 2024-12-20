import { ScheduleData } from './schedule';
import { Date } from './common';
export type ViewType = 'day' | 'week' | 'month' | 'D' | 'W' | 'M';

export type Options = {
  data: ScheduleData;
  date?: Date;
  viewType: ViewType;
};
