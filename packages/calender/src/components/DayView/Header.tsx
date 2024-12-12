import { cls } from '@/utils/css';
import Scrollbar from '../Scrollbar';
export function TodayScheduleRow() {
  return <div className={cls('today-schedule-item')}></div>;
}

export default function Header() {
  return (
    <div className={cls('day-header')}>
      <div className={cls('day-header-date')}>
        <span className={cls('day-header-date-text')}>GMT+8</span>
      </div>
      <Scrollbar className={cls('day-header-today-tasks')} hideBar>
        <TodayScheduleRow />
        <TodayScheduleRow />
        <TodayScheduleRow />
      </Scrollbar>
    </div>
  );
}
