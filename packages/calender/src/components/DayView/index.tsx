import { ComponentChildren } from 'preact';
import { useEffect, useState, useRef, useMemo } from 'preact/hooks';
import { TimeList } from '@wcalender/types/time';
import Scrollbar from '../Scrollbar';
import { cls } from '@/utils/css';
import { getTimes, getReturnTime } from '@/utils/time';
import { setElementStyle, getTransform, numToPx } from '@/utils/dom';
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
import { isUndef } from '@/utils/is';

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
 * 计算偏移量转换为时间
 */
function offsetToTimeValue(offset: number) {
  return (interval / colH) * 60 * offset;
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
  const [dragConfig, setDragConf] = useState<{ rect: Rect; data: RenderTime } | null>(null);
  const containerSize = useElementBounding(scrollContainer);

  const { todayData, renderData } = useData({
    data: props.data,
  });

  /**
   * 拖动时的时间
   */
  const dragTime = useMemo(() => {
    if (isUndef(dragConfig)) return null;
    return dragConfig.data.start.time.format('YYYY-MM-DD HH:mm');
  }, [dragConfig]);

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
      setDragConf({ rect: { ...rect }, data });
      position = { ...rect };
    },
    [DRAG_MOVE]: (event, data: RenderTime) => {
      position.y += event.dy;
      let dragEl = document.querySelector(`.${cls('drag-block')}`);
      if (dragEl) {
        setElementStyle(
          dragEl as HTMLElement,
          getTransform({
            width: '100%',
            height: numToPx(position.h),
            left: numToPx(position.x),
            top: numToPx(position.y),
          })
        );
      }
      let dragData = { ...data };
      dragData.start = getReturnTime(
        dayjs()
          .startOf('day')
          .add(offsetToTimeValue(position.y + 21), 'second')
      );
      dragData.end = getReturnTime(
        dayjs()
          .startOf('day')
          .add(offsetToTimeValue(position.y + position.h), 'second')
      );
      setDragConf({
        rect: position,
        data: dragData,
      });
    },
    [DRAG_END]: () => {
      setDragConf(null);
    },
    [RESIZE_START]: (e: any, data: RenderTime, rect: Rect) => {
      setDragConf({ rect, data });
      position = rect;
    },
    [RESIZE_MOVE]: (event) => {
      let dragEl = document.querySelector(`.${cls('drag-block')}`);
      if (dragEl) {
        setElementStyle(dragEl as HTMLElement, {
          width: '100%',
          height: numToPx(event.rect.height),
        });
      }
    },
    [RESIZE_END]: () => {
      setDragConf(null);
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
            {dragConfig && (
              <DragBlock layout={dragConfig.rect}>
                {dragTime}
                <TimeContent title={dragConfig.data.title} />
              </DragBlock>
            )}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
}

export default DayView;
