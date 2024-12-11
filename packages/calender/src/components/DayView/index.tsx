import './index.scss';
import { cls } from '../../utils/css';
import Scrollbar from '../Scrollbar';
export default function DayView() {
  return (
    <div className={cls('day')}>
      <div className={cls('day-header')}>
        <div className={cls('day-header-date')}>
          <span>GMT+8</span>
        </div>
        <div className={cls('day-header-today-tasks')}></div>
      </div>
      <div className={cls('day-tasks')}>
        <Scrollbar>{() => <div style={{ width: '100%', height: '1200px' }}></div>}</Scrollbar>
      </div>
    </div>
  );
}
