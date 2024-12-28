import { ComponentChildren } from 'preact';
import type { ScheduleData } from './schedule';
import type { Dayjs } from 'dayjs';
export type Date = [string | Dayjs, string | Dayjs] | string | Dayjs;

export interface ChCalenderOptions {
  data: ScheduleData;
}

export type PropsWithChildren<Props = {}> = Props & { children?: ComponentChildren };

export type GetDefaultOptions = <T extends object>(defaultOptions: Required<T>) => Required<T>;
