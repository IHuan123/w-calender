import { ScheduleItem } from './schedule';
export interface EventsProps {
  onUpdate(e: { data: ScheduleItem }): void;
}
