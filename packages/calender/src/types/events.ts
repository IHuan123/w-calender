import { CalenderItem } from './options';
export interface EventsProps {
  onBeforeUpdate?: (value?: {
    target: CalenderItem;
    data: CalenderItem[];
  }) => boolean | Promise<boolean>;
  onChange?: (e: { target: CalenderItem; data: CalenderItem[] }) => void;
}
