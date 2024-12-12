import { useEffect, useState, useRef } from 'preact/hooks';
import { TimeList } from '@wcalender/types/time';
import Scrollbar from '../Scrollbar';
import { cls } from '@/utils/css';
import { getTimes } from '@/utils/time';
import dayjs from 'dayjs';
import Header from './Header';
import ScheduleCard from './ScheduleCard';

import './style/index.scss';

export type DayViewProps = {};

/**
 * @zh 当天的开始时间和结束时间
 */
const startTime = dayjs().startOf('day').add(1, 'hour'),
  endTime = dayjs().endOf('day');

function DayView(props: DayViewProps) {
  const [timeList, setTimeList] = useState<TimeList>();

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
            <ScheduleCard startTime="" endTime="" title="" />
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
