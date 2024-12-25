import { VNode } from 'preact';
import { ScheduleData } from './schedule';
import { Date } from './common';
export type ViewType = 'day' | 'week' | 'month' | 'D' | 'W' | 'M';

export type Template = string | VNode;
/**
 * @zh WCalender类options配置项
 */
export type Options = {
  data: ScheduleData;
  date?: Date;
  viewType: ViewType;
  templates?: Partial<Record<ViewType, Partial<Record<'drag' | 'add', Template>>>>; // 自定义模版
};
