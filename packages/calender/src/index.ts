import { render } from 'preact';
import { DayView } from './components';
import { Options } from './types/common';

import type { ScheduleData, ScheduleItem } from './types/schedule';

class ChCalender {
  el: HTMLElement;
  options?: Options;
  constructor(el: HTMLElement, options: Options) {
    this.el = el;
    this.setOptions(options);
    this.render();
  }
  render() {
    render(
      DayView({
        data: [],
      }),
      this.el
    );
  }
  // 加载数据
  data(data: ScheduleData) {}
  setOptions(options: Options) {
    this.options = options;
  }
}

export { DayView };
export default ChCalender;

/**
 * @zh types export
 */
export type { Options, ScheduleData, ScheduleItem };
