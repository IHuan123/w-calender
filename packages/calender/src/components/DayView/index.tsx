import { useEffect, useState, useRef } from 'preact/hooks';
import { TimeList, ReturnTimeValue } from '@wcalender/types/time';
import Scrollbar from '../Scrollbar';
import { cls } from '@/utils/css';
import { getTimes } from '@/utils/time';
import Header from './Header';
import TimeContent from './TimeContent';
import type { ScheduleData, DateRange } from '@/types/schedule';
import './style/index.scss';

export type DayViewProps = {
  data?: ScheduleData;
  date: DateRange;
};

/**
 * @zh 获取时间列表
 */
function getTimeList(date: DateRange) {
  if (!date) {
    return [];
  }
  const [start, end] = date;
  const startTime = start.time.startOf('day').add(1, 'hour'),
    endTime = end.time.endOf('day');
  return getTimes(startTime, endTime, 30, 'minute');
}

function DayView(props: DayViewProps) {
  const [timeList, setTimeList] = useState<TimeList>();

  useEffect(() => {
    let data = getTimeList(props.date);
    setTimeList(data);
  }, [props.date]);

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
            <TimeContent startTime="" endTime="" title="" />
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
