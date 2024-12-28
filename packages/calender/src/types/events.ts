import { CalenderItem } from './options';
export interface EventsProps {
  onChange(e: { target: CalenderItem; data: CalenderItem[] }): void;
}
