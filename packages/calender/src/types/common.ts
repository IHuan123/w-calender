import type { ScheduleData } from './schedule';
import type { Dayjs } from 'dayjs';

export type Date = [string | Dayjs, string | Dayjs] | string | Dayjs;

export type Options = {
  data: ScheduleData;
  date?: Date;
};

export interface ChCalenderOptions {
  data: ScheduleData;
}
