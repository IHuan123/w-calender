import { RenderTime } from './DayView';
export interface EventsProps {
  onChange(e: { data: RenderTime }): void;
}
