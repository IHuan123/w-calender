import { cls } from '@/utils/css';

export function TodayScheduleRow() {
  return <div></div>;
}

export default function Header() {
  return (
    <div className={cls('day-header')}>
      <div className={cls('day-header-date')}>
        <span className={cls('day-header-date-text')}>GMT+8</span>
      </div>
      <div className={cls('day-header-today-tasks')}>
        <TodayScheduleRow></TodayScheduleRow>
      </div>
    </div>
  );
}
