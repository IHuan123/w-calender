import { ComponentChildren } from 'preact';
import { useEffect, useState, useRef, useMemo } from 'preact/hooks';
import { TimeList } from '@wcalender/types/time';
import Scrollbar from '../Scrollbar';
import { cls } from '@/utils/css';
import { getTimes } from '@/utils/time';
import Header from './Header';
import TimeContent from './TimeContent';
import TimeLine from './TimeLine';
import TimeIndicateLine from './TimeIndicateLine';
import type { DateRange } from '@/types/schedule';
import type { DayViewProps, RenderTime, Rect } from '@wcalender/types/DayView';
import GirdBox from './GirdBox';
import useData from './hooks/useData';
import useElementBounding from '@/hooks/useResize';
import dayjs, { Dayjs } from 'dayjs';
import {
  DRAG_START,
  DRAG_MOVE,
  DRAG_END,
  RESIZE_START,
  RESIZE_MOVE,
  RESIZE_END,
} from '@/constant/busEventName';
import './style/index.scss';
import useBusListener from '@/hooks/useBusListener';
import { genStyles } from '../_utils';

const colH = 42;
const interval = 30;
const gap = 8;
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
 * @zh 计算时间Y位置
 */
function calculateDistance(start: Dayjs, end: Dayjs, colHeight: number) {
  let timeValue = end.diff(start, 'second');

  return (timeValue / (interval * 60)) * colHeight;
}

/**
 * @zh 计算y ,h坐标位置信息
 */
function calculateRect(
  item: RenderTime & {
    colIndex: number;
  },
  totalColumn: number,
  colHeight: number,
  containerWidth: number
) {
  const { start, end, colIndex } = item;
  let x = (colIndex / totalColumn) * containerWidth;
  let y = calculateDistance(start.time.startOf('day'), start.time, colHeight);
  let w = containerWidth / totalColumn;
  let h = calculateDistance(start.time, end.time, colHeight);
  return { x, y, w, h };
}

function DayView(props: DayViewProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [timeList, setTimeList] = useState<TimeList>([]);
  const [dragLayout, setDragLayout] = useState<{ rect: Rect; data: RenderTime } | null>(null);
  const containerSize = useElementBounding(scrollContainer);

  const { todayData, renderData } = useData({
    data: props.data,
  });

  useEffect(() => {
    let data = getTimeList(props.date);
    setTimeList(data);
  }, [props.date, props.data]);

  /**
   * @zh 初始化bus事件
   */
  let position: Rect = { x: 0, y: 0, w: 0, h: 0 };
  useBusListener({
    [DRAG_START]: (e: any, data: RenderTime, rect: Rect) => {
      setDragLayout({ rect: { ...rect }, data });
      position = { ...rect };
    },
    [DRAG_MOVE]: (event) => {
      position.y += event.dy;
      let dragEl = document.querySelector(`.${cls('drag-block')}`);
      if (dragEl) {
        (dragEl as HTMLElement).style.transform = `translate(${position.x}px, ${position.y}px)`;
      }

      // 这里需要 优化
      console.log(dragLayout);
    },
    [DRAG_END]: () => {
      setDragLayout(null);
    },
    [RESIZE_START]: (e: any, data: RenderTime, rect: Rect) => {
      setDragLayout({ rect, data });
      position = rect;
    },
    [RESIZE_MOVE]: (event) => {
      let dragEl = document.querySelector(`.${cls('drag-block')}`);
      if (dragEl) {
        Object.assign((dragEl as HTMLElement).style, {
          width: '100%',
          height: `${event.rect.height}px`,
        });
      }
    },
    [RESIZE_END]: () => {
      setDragLayout(null);
    },
  });

  /**
   * @zh 拖拽样式
   */
  function DragBlock({ layout, children }: { layout: Rect; children?: ComponentChildren }) {
    return (
      <div className={cls('drag-block')} style={genStyles(layout)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cls('day')}>
      <Header data={todayData} />
      <Scrollbar hideBar className={cls('grid-scrollbar')}>
        <div className={cls('day-grid')} style={{ '--col-h': colH + 'px' }}>
          <TimeLine data={timeList} />
          <div className={cls('day-grid-layout')} ref={scrollContainer}>
            {renderData?.map((group) =>
              group.data.map((item) => (
                <GirdBox
                  {...calculateRect(item, group.totalColumn, colH, containerSize.width)}
                  key={item._key}
                  data={item}
                  colH={colH}
                  interval={interval}
                >
                  <TimeContent title={item.title} />
                </GirdBox>
              ))
            )}

            <TimeIndicateLine top={calculateDistance(dayjs().startOf('day'), dayjs(), colH)} />
            {dragLayout && (
              <DragBlock layout={dragLayout.rect}>
                <TimeContent title={dragLayout.data.title} />
              </DragBlock>
            )}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
}

export default DayView;
