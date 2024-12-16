import { ComponentChildren } from 'preact';
import { ReturnTimeValue } from '@wcalender/types/time';
import type { ScheduleData, DateRange, timeType } from '@/types/schedule';
export type DayViewProps = {
  data: ScheduleData;
  date: DateRange;
};

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

export interface GridBoxProps {
  w: number | string;
  h: number;
  x: number | string;
  y: number;
  className?: string;
  children?: ComponentChildren;
}
