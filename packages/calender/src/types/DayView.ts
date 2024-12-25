import { ComponentChildren } from 'preact';
import { ReturnTimeValue } from '@wcalender/types/time';
import type { timeType } from '@/types/schedule';

export type RenderTime = {
  title: string;
  start: ReturnTimeValue;
  end: ReturnTimeValue;
  type: timeType;
  _key: string;
};

export interface HeaderProps {
  data: Array<RenderTime>;
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
  data: RenderTime;
  colH?: number;
  interval?: number;
  onMoveStart?(event: any, data: RenderTime, rect: Rect): void;
  onMove?(event: any, data: RenderTime, rect: Rect): void;
  onMoveEnd?(event: any, data: RenderTime, rect: Rect): void;
  onResizeStart?(event: any, data: RenderTime, rect: Rect): void;
  onResize?(event: any, data: RenderTime, rect: Rect): void;
  onResizeEnd?(event: any, data: RenderTime, rect: Rect): void;
  onTap?(event: any, data: RenderTime, rect: Rect): void;
}
