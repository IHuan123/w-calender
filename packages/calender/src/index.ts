import { render } from 'preact';
import { DayView } from './components';
export interface ChCalenderOptions {}
class ChCalender {
  el: HTMLElement;
  options: ChCalenderOptions;
  constructor(el: HTMLElement, options: ChCalenderOptions) {
    this.el = el;
    this.options = options;
    this.render();
  }
  render() {
    render(DayView(), this.el);
  }
}

export default ChCalender;
