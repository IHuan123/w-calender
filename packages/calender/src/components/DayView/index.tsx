import './style/index.scss';
import { useEffect, useRef, useMemo } from 'preact/compat';
import { TimeList } from '@wcalender/types/time';
import Scrollbar from '../Scrollbar';
import Header from './Header';
import TimeLine from './TimeLine';
import TimeIndicateLine from './TimeIndicateLine';
import Column from '../Column';
import { DayViewProps } from '@/types/components';
import { useXState } from '@/hooks';
import dayjs, { Dayjs } from 'dayjs';
import { useStore } from '@/contexts/calenderStore';
import { cls } from '@/utils';
import { genTimeSlice } from '../_utils';

const colH = 42;
const interval = 30;
const gap = 8;

/**
 * @zh 计算时间Y位置
 */
function calculateDistance(start: Dayjs, end: Dayjs, colHeight: number) {
  let timeValue = end.diff(start, 'second');
  return (timeValue / (interval * 60)) * colHeight;
}

function DayView(props: DayViewProps) {
  const layoutContainer = useRef<HTMLDivElement>(null);
  const [timeList, setTimeList] = useXState<TimeList>([]);

  const { getState } = useStore();

  // 这里的数据需统一使用store存储
  const data = useRef(getState('data'));
  // 头部列表渲染
  const todayData = useMemo(() => {
    return data.current?.filter((item: { type: string }) => item.type === 'day') ?? [];
  }, [data]);

  useEffect(() => {
    let data = genTimeSlice(props.date, interval);
    setTimeList(data);
  }, [props.date]);

  return (
    <div className={cls('day')}>
      <Header data={todayData} />
      <Scrollbar hideBar className={cls('grid-scrollbar')}>
        <div className={cls('day-grid')} style={{ '--col-h': colH + 'px' }}>
          <TimeLine data={timeList} />
          <div className={cls('day-grid-layout')} ref={layoutContainer}>
            <Column data={data.current} date={props.date} cellHeight={42} bordered={false} />
            <TimeIndicateLine top={calculateDistance(dayjs().startOf('day'), dayjs(), colH)} />
          </div>
        </div>
      </Scrollbar>
    </div>
  );
}

export default DayView;
