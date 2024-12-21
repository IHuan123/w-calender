import { ComponentChildren } from 'preact';
import { useEffect, useState, useRef, useMemo } from 'preact/hooks';
import { TimeList } from '@wcalender/types/time';
import Scrollbar from '../Scrollbar';
import { cls } from '@/utils/css';
import { getTimes, getReturnTime, format } from '@/utils/time';
import { setElementStyle, getTransform, numToPx } from '@/utils/dom';
import Header from './Header';
import TimeContent from './TimeContent';
import TimeLine from './TimeLine';
import TimeIndicateLine from './TimeIndicateLine';
import type { DateRange } from '@/types/schedule';
import type { RenderTime, Rect } from '@wcalender/types/DayView';
import { DayViewProps } from '@/types/components';
import GirdBox from './GirdBox';
import useData from './hooks/useData';
import useElementBounding from '@/hooks/useResize';
import dayjs, { Dayjs } from 'dayjs';
import './style/index.scss';
import { genStyles } from '../_utils';
import { isUndef } from '@/utils/is';
import { deepClone } from '@/utils/common';

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

type DragConfig = { rect: Rect; data: RenderTime } | null;
function DayView(props: DayViewProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [timeList, setTimeList] = useState<TimeList>([]);
  let position: Rect = { x: 0, y: 0, w: 0, h: 0 };
  const [dragConfig, setDragConf] = useState<DragConfig>(null);
  const containerSize = useElementBounding(scrollContainer);

  const { todayData, renderData } = useData({
    data: props.data,
  });

  /**
   * 拖动时的时间
   */
  const dragTime = useMemo(() => {
    if (isUndef(dragConfig)) return null;
    let start = format(dragConfig.data.start, 'YYYY-MM-DD HH:mm');
    let end = format(dragConfig.data.end, 'YYYY-MM-DD HH:mm');
    return { start, end };
  }, [dragConfig]);

  useEffect(() => {
    let data = getTimeList(props.date);
    setTimeList(data);
  }, [props.date, props.data]);

  /**
   * @zh bus 手势事件监听
   * @en init bus event
   */

  function onMoveStart(event: any, data: RenderTime, rect: Rect) {
    setDragConf({ rect: deepClone(rect), data });
    position = deepClone(rect);
  }
  function onMove(event: any, data: RenderTime, rect: Rect) {
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
      dayjs().startOf('day').add(offsetToTimeValue(position.y), 'second')
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
  }
  function onResizeStart(event: any, data: RenderTime, rect: Rect) {
    setDragConf({ rect, data });
    position = deepClone(rect);
  }
  function onResize(event: any, data: RenderTime, rect: Rect) {
    let dragEl = document.querySelector(`.${cls('drag-block')}`);
    if (dragEl) {
      setElementStyle(dragEl as HTMLElement, {
        width: '100%',
        height: numToPx(event.rect.height),
      });
    }
  }

  /**
   * @zh 数据更新事件
   */
  async function onChange(event: any, data: RenderTime) {
    props.onChange({ data });
    setDragConf(null);
  }
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
                  onMoveStart={onMoveStart}
                  onMove={onMove}
                  onMoveEnd={onChange}
                  onResizeStart={onResizeStart}
                  onResizeEnd={onChange}
                  onResize={onResize}
                >
                  <TimeContent
                    title={`${item.title}-${format(item.start, 'HH:mm')}:${format(item.end, 'HH:mm')}`}
                  />
                </GirdBox>
              ))
            )}

            <TimeIndicateLine top={calculateDistance(dayjs().startOf('day'), dayjs(), colH)} />
            {dragConfig && (
              <DragBlock layout={dragConfig.rect}>
                <TimeContent title={dragTime?.start + ':' + dragTime?.end} />
              </DragBlock>
            )}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
}

export default DayView;
