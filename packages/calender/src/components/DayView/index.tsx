import './index.scss';
import { cls } from '../../utils/css';
export default function DayView() {
  return (
    <div className={cls('day')}>
      <div className={cls('day-header')}>
        <div className={cls('day-header-date')}>
          <span>GMT+8</span>
        </div>
        <div className={cls('day-header-today-tasks')}></div>
      </div>
      <div className={cls('day-scrollbar')}></div>
    </div>
  );
}
