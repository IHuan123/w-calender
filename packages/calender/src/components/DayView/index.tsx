import { useEffect, useState } from 'preact/hooks';
import { TimeList, ReturnTimeValue } from '@wcalender/types/time';
import Scrollbar from '../Scrollbar';
import { cls } from '@/utils/css';
import { getTimes } from '@/utils/time';
import Header from './Header';
import TimeContent from './TimeContent';
import TimeLine from './TimeLine';
import type { DateRange } from '@/types/schedule';
import type { DayViewProps } from '@wcalender/types/DayView';
import GirdBox from './GirdBox';
import useData from './hooks/useData';
import './style/index.scss';

const colH = 42;
const interval = 60;
/**
 * @zh 获取时间列表
 */
function getTimeList(date: DateRange) {
  if (!date) {
    return [];
  }
  const [start, end] = date;
  const startTime = start.time.startOf('day'),
    endTime = end.time.endOf('day');
  return getTimes(startTime, endTime, interval, 'minute');
}

/**
 * @zh 计算x,y坐标位置信息
 */
function calculateXY(start: ReturnTimeValue, end: ReturnTimeValue) {
  let startTimeValue = start.time.diff(start.time.startOf('day'), 'second');
  let timeValue = end.time.diff(start.time, 'second');
  let y = (startTimeValue / (interval * 60)) * colH;
  let h = (timeValue / (interval * 60)) * colH;

  let posi = {
    x: 0,
    y: y,
    h,
  };
  return posi;
}

function DayView(props: DayViewProps) {
  const [timeList, setTimeList] = useState<TimeList>([]);
  const { todayData, renderData } = useData({
    data: props.data,
    colHeight: colH,
    interval: interval,
  });

  useEffect(() => {
    let data = getTimeList(props.date);
    setTimeList(data);
  }, [props.date, props.data]);

  return (
    <div className={cls('day')}>
      <Header data={todayData} />
      <Scrollbar hideBar className={cls('grid-scrollbar')}>
        <div className={cls('day-grid')} style={{ '--col-h': colH + 'px' }}>
          <TimeLine data={timeList} />
          <div className={cls('day-grid-layout')}>
            {renderData?.map((item) => (
              <GirdBox w={item.rect.w} h={item.rect.h} x={item.rect.x} y={item.rect.y}>
                <TimeContent title={item.title} />
              </GirdBox>
            ))}

            {timeList?.map((item) => {
              return <div className={cls('day-grid-layout-col')}></div>;
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
