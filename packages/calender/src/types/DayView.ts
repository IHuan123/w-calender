import { ComponentChildren } from 'preact';
import { CalenderItem } from './options';

export interface HeaderProps {
  data: Array<CalenderItem>;
}

export interface ScheduleCardProps {
  title: string;
  startTime?: string;
  endTime?: string;
  className?: string;
}

export type Rect = {
  x: number | string;
  y: number;
  h: number;
  w: number | string;
};

export interface GridBoxProps extends Rect {
  className?: string;
  children?: ComponentChildren;
  data: CalenderItem;
  colH?: number;
  interval?: number;
  onMoveStart?(event: any, data: CalenderItem, rect: Rect): void;
  onMove?(event: any, data: CalenderItem, rect: Rect): void;
  onMoveEnd?(event: any, data: CalenderItem, rect: Rect): void;
  onResizeStart?(event: any, data: CalenderItem, rect: Rect): void;
  onResize?(event: any, data: CalenderItem, rect: Rect): void;
  onResizeEnd?(event: any, data: CalenderItem, rect: Rect): void;
  onTap?(event: any, data: CalenderItem, rect: Rect): void;
}
