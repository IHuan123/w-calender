import { ComponentChildren } from 'preact';
import { forwardRef, useEffect, useState, useRef, useMemo } from 'preact/compat';
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
  const dragBlockRef = useRef<HTMLDivElement>(null);
  const [dragConfig, setDragConf] = useState<DragConfig>(null);
  const containerSize = useElementBounding(scrollContainer);

  // 这里的数据需统一使用store存储
  const { todayData, renderData, calenderData, setCalenderData } = useData({
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
   * @zh 开始移动
   */
  function onMoveStart(event: any, data: RenderTime, rect: Rect) {
    setDragConf({ rect: { ...position, w: '100%', x: 0 }, data });
    position = rect;
  }

  /**
   * @zh 移动中
   */
  function onMove(event: any, data: RenderTime, rect: Rect) {
    position.y += event.dy;
    let dragEl = document.querySelector(`.${cls('drag-block')}`);
    if (dragEl) {
      setElementStyle(
        dragEl as HTMLElement,
        getTransform({
          width: '100%',
          height: numToPx(position.h),
          left: numToPx(0),
          top: numToPx(position.y),
        })
      );
    }
    handleUpdateData(event, data);
  }

  function onMoveEnd(event: any, data: RenderTime) {
    dragBlockRef.current?.click();
    setDragConf(null);
  }
  /**
   * @zh resize start
   */
  function onResizeStart(event: any, data: RenderTime, rect: Rect) {
    setDragConf({ rect, data });
    position = { ...rect };
  }

  function onResize(event: any, data: RenderTime, rect: Rect) {
    let dragEl = document.querySelector(`.${cls('drag-block')}`);
    if (dragEl) {
      setElementStyle(dragEl as HTMLElement, {
        width: '100%',
        height: numToPx(event.rect.height),
      });
    }
    handleUpdateData(event, data);
  }
  /**
   * @zh 容器大小变更事件
   */
  function onResizeEnd(event: any, data: RenderTime) {
    dragBlockRef.current?.click();
    setDragConf(null);
  }

  /**
   * @zh 处理数据
   */
  function handleUpdateData(event: any, data: RenderTime) {
    let dragData = { ...data };
    dragData.start = getReturnTime(
      dayjs().startOf('day').add(offsetToTimeValue(position.y), 'second')
    );
    dragData.end = getReturnTime(
      dayjs()
        .startOf('day')
        .add(offsetToTimeValue(position.y + event.rect.height), 'second')
    );
    setDragConf({
      rect: { y: position.y, w: '100%', x: 0, h: event.rect.height },
      data: dragData,
    });
  }

  /**
   * @zh 数据更新事件
   */
  async function onChange(data: RenderTime) {
    updateData(data);
  }

  /**
   * @zh 更新数据
   */
  function updateData(target: RenderTime) {
    let data = [...calenderData];
    let index = data.findIndex((item) => item._key === target._key);
    data[index] = target;
    setCalenderData(() => data);
    props.onChange({ target: target, data });
  }

  /**
   * @zh 拖拽样式
   */
  const DragBlock = forwardRef<
    HTMLDivElement,
    { layout: Rect; children?: ComponentChildren; onTrigger?: Function }
  >(({ layout, onTrigger, children }, ref) => {
    return (
      <div
        className={cls('drag-block')}
        style={genStyles(layout)}
        ref={ref}
        onClick={() => onTrigger?.()}
      >
        {children}
      </div>
    );
  });

  /**
   * @zh 添加时间段
   */
  function add() {}

  return (
    <div className={cls('day')}>
      <Header data={todayData} />
      <Scrollbar hideBar className={cls('grid-scrollbar')}>
        <div className={cls('day-grid')} style={{ '--col-h': colH + 'px' }}>
          <TimeLine data={timeList} />
          <div className={cls('day-grid-layout')} ref={scrollContainer}>
            {renderData?.map((group) =>
              group.data.map(({ colIndex, ...config }) => (
                <GirdBox
                  {...calculateRect(
                    { ...config, colIndex },
                    group.totalColumn,
                    colH,
                    containerSize.width
                  )}
                  key={config._key}
                  data={config}
                  colH={colH}
                  interval={interval}
                  onMoveStart={onMoveStart}
                  onMove={onMove}
                  onMoveEnd={onMoveEnd}
                  onResizeStart={onResizeStart}
                  onResizeEnd={onResizeEnd}
                  onResize={onResize}
                >
                  {/* 自定义日程卡片，需支持自定义 */}
                  <TimeContent
                    title={`${config.title}-${format(config.start, 'HH:mm')}:${format(config.end, 'HH:mm')}`}
                  />
                </GirdBox>
              ))
            )}

            <TimeIndicateLine top={calculateDistance(dayjs().startOf('day'), dayjs(), colH)} />
            {dragConfig && (
              <DragBlock
                layout={dragConfig.rect}
                ref={dragBlockRef}
                onTrigger={() => {
                  onChange(dragConfig.data);
                }}
              >
                <div style="background: red; height: 100%">
                  {/* 这里拖动时显示组件,需支持自定义 */}
                  {dragTime?.start + ':' + dragTime?.end}
                </div>
              </DragBlock>
            )}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
}

export default DayView;
