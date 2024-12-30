import { render, FunctionComponent, useEffect } from 'preact/compat';
import { DayView, WeekView, MonthView } from '@/components';
import Column from './components/Column';

import { getReturnTime, getTimeStartAndEnd } from '@/utils/time';
import { createUniqueId } from '@/utils/common';
import { isArray } from '@/utils/is';
import { StoreProvider } from './contexts/calenderStore';
import { useXState } from '@/hooks';

import type { UnitType } from 'dayjs';
import type { DayViewProps } from '@/types/components';
import type { Options, CalenderItem } from '@/types/options';
import type { Date } from '@/types/common';
import type { ViewType } from '@/types/options';
import type { ScheduleData, ScheduleItem, DateRange, timeType } from '@/types/schedule';

const defaultOptions: Required<Options> = {
  date: '',
  data: [],
  viewType: 'D',
  templates: {},
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
  const [store, setStore, getStore] = useXState({ data: props.data });
  useEffect(() => {
    setStore({ ...store, data: props.data });
  }, [props.data]);
  const Component = views[props.viewType];
  return (
    <StoreProvider store={store}>
      <Component date={props.date} onChange={props.onChange} />
    </StoreProvider>
  );
}

/**
 * @zh 处理时间
 */
function getDate(date: Date, type?: timeType): DateRange {
  if (isArray(date)) {
    let [start, end] = date;
    let startTime = getReturnTime(start);
    let endTime = getReturnTime(end);
    return [startTime, endTime];
  }
  return getTimeStartAndEnd(date, { day: 'D', time: 'h' }[type ?? 'day'] as UnitType);
}

/**
 * @zh 处理data数据，数据存在交叉时进行等比排布
 */
function getData(data: ScheduleData): Array<CalenderItem> {
  return data.map((item) => {
    let start = getReturnTime(item.start),
      end = getReturnTime(item.end);

    let config = {
      title: item.title,
      start: start,
      end: end,
      type: item.type,
      _key: createUniqueId(),
      _raw: item,
    };

    return config;
  });
}

class ChCalender {
  el: HTMLElement;
  options: Options = defaultOptions;
  data: CalenderItem[] = [];
  constructor(el: HTMLElement, options: Partial<Options>) {
    this.el = el;
    this.setOptions(options);
    this.render();
  }

  // 处理数据格式
  private formatData(data: ScheduleData) {
    this.data = getData(data);
  }
  // 加载数据
  loadData(data: ScheduleData) {
    this.options.data = data;
    this.formatData(data);
  }
  // 设置配置
  setOptions(options: Partial<Options>) {
    this.options = { ...defaultOptions, ...options };
    this.formatData(this.options.data);
  }
  // 更新视图
  update() {
    this.render();
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
  onChange() {
    // 数据更新
  }

  // 渲染组件
  render() {
    render(
      <RenderContent
        viewType={this.options.viewType}
        data={this.data}
        date={getDate(this.options.date as Date)}
        onChange={(e) => {
          console.log(e);
          this.onChange();
        }}
      />,
      this.el
    );
  }
  testRender() {
    render(
      <Column data={this.data} date={getDate(this.options.date as Date)} cellHeight={42} />,
      document.querySelector('#calender-column') as Element
    );
  }
}

export { DayView, WeekView, MonthView };
export default ChCalender;

/**
 * @zh types export
 */
export type { Options, ScheduleData, ScheduleItem };
