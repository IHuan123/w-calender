import { render, FunctionComponent } from 'preact';
import { DayView, WeekView, MonthView } from '@/components';
import { Options } from '@/types/options';
import { Date } from '@/types/common';
import { ViewType } from '@/types/options';
import type { ScheduleData, ScheduleItem, DateRange, timeType } from '@/types/schedule';
import { getReturnTime, getTimeStartAndEnd } from '@/utils/time';
import { isArray } from '@/utils/is';
import { UnitType } from 'dayjs';
import { DayViewProps } from '@/types/components';

const defaultOptions: Required<Options> = {
  date: '',
  data: [],
  viewType: 'D',
};
const views: Record<ViewType, FunctionComponent<any>> = {
  day: DayView,
  D: DayView,
  week: WeekView,
  W: WeekView,
  month: MonthView,
  M: MonthView,
};

interface DayProps extends DayViewProps {
  viewType: 'D' | 'day';
}

interface WeekProps extends DayViewProps {
  viewType: 'W' | 'week';
}

interface MonthProps extends DayViewProps {
  viewType: 'M' | 'month';
}

function RenderContent(props: DayProps | WeekProps | MonthProps) {
  const Component = views[props.viewType];
  return <Component {...props} />;
}

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
    render(
      <RenderContent
        viewType={this.options.viewType}
        data={this.options.data}
        date={getDate(this.options.date as Date)}
        onUpdate={(e) => {
          console.log(e);
          this.onUpdate();
        }}
      />,
      this.el
    );
  }

  // 加载数据
  data(data: ScheduleData) {
    this.options.data = data;
  }
  // 设置配置
  setOptions(options: Partial<Options>) {
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * 组件类钩子函数
   */
  onMount() {
    // 组件加载
  }
  onUnmount() {
    // 组件卸载
  }
  onUpdate() {
    // 数据更新
  }
}

export { DayView, WeekView, MonthView };
export default ChCalender;

/**
 * @zh types export
 */
export type { Options, ScheduleData, ScheduleItem };
