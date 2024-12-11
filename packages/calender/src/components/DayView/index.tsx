import { useEffect, useState } from 'preact/hooks';
import { TimeList } from '@wcalender/types/time';
import Scrollbar from '../Scrollbar';
import { cls } from '@/utils/css';
import { getTimes } from '@/utils/time';
import dayjs from 'dayjs';
import Header from './Header';
import './index.scss';

export type DayViewProps = {};

function DayView(props: DayViewProps) {
  const [timeList, setTimeList] = useState<TimeList>();
  const startTime = dayjs().startOf('day'),
    endTime = dayjs().endOf('day');
  useEffect(() => {
    let data = getTimes(startTime, endTime, 30, 'minute');
    setTimeList(data);
  }, [startTime, endTime]);
  return (
    <div className={cls('day')}>
      <Header />
      <Scrollbar hideBar className={cls('task-scrollbar')}>
        <div className={cls('day-tasks')}>
          <div className={cls('day-tasks-time')}>
            {timeList?.map((item) => {
              return (
                <div className={cls('day-tasks-time-col')}>
                  <span className={cls('day-tasks-time-col-label')}>
                    {item.time.time.format('HH:mm')}
                  </span>
                </div>
              );
            })}
          </div>
          <div className={cls('day-tasks-list')}>
            {timeList?.map((item) => {
              return <div className={cls('day-tasks-list-time-col')}></div>;
            })}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
}

/**
 * 直接出 会出现问题
 */
export default (props: DayViewProps) => <DayView {...props} />;
