import { DayView } from './components';
export { DayView };
export interface ChCalenderOptions {
}
declare class ChCalender {
    el: HTMLElement;
    options: ChCalenderOptions;
    constructor(el: HTMLElement, options: ChCalenderOptions);
    render(): void;
}
export default ChCalender;
