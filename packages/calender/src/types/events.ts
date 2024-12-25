import { RenderTime } from './DayView';
export interface EventsProps {
  onChange(e: { target: RenderTime; data: RenderTime[] }): void;
}
