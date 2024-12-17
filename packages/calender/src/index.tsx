import { render, FunctionComponent } from 'preact';
import { DayView, WeekView, MonthView } from '@/components';
import { Options, Date } from '@/types/common';
import { ViewType } from '@/types/options';
import type { ScheduleData, ScheduleItem, DateRange, timeType } from '@/types/schedule';
import { getReturnTime, getTimeStartAndEnd } from '@/utils/time';
import { isArray } from '@/utils/is';
import { UnitType } from 'dayjs';
const defaultOptions: Required<Options> = {
  date: '',
  data: [],
};
const views: Record<ViewType, FunctionComponent<any>> = {
  day: DayView,
  D: DayView,
  week: WeekView,
  W: WeekView,
  month: MonthView,
  M: MonthView,
};
/**
 * @zh 处理时间
 */
function getDate(date: Date, type?: timeType): DateRange {
  let res = [];
  if (isArray(date)) {
    let [start, end] = date;
    let startTime = getReturnTime(start);
    let endTime = getReturnTime(end);
    return [startTime, endTime];
  }
  return getTimeStartAndEnd(date, { day: 'D', time: 'h' }[type ?? 'day'] as UnitType);
}

class ChCalender {
  el: HTMLElement;
  options: Options = defaultOptions;
  constructor(el: HTMLElement, options: Partial<Options>) {
    this.el = el;
    this.setOptions(options);
    this.render();
  }
  render() {
    render(<DayView data={this.options.data} date={getDate(this.options.date as Date)} />, this.el);
  }

  // 加载数据
  data(data: ScheduleData) {
    this.options.data = data;
  }
  // 设置配置
  setOptions(options: Partial<Options>) {
    this.options = { ...defaultOptions, ...options };
  }
}

export { DayView };
export default ChCalender;

/**
 * @zh types export
 */
export type { Options, ScheduleData, ScheduleItem };
