import type { ScheduleData, DateRange, timeType } from './schedule';
import { EventsProps } from './events';
export interface DayViewProps extends EventsProps {
  data: ScheduleData;
  date: DateRange;
}
